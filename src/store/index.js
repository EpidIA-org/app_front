import Vue from 'vue';
import Vuex from 'vuex';
import axios from "axios";
import AREAS_JSON from '../data/availableAreas.json'
import NEIGHBS_JSON from '../data/neighborAreas.json'
import KPIS_JSON from '../data/availableKPIS.json'
import CONTRIBUTORS_JSON from '../data/contributors.json'
import { reduceObject } from '../utils'

// use store
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        // API URL in .env* files Local/Prod
        APP_URL_PROD: process.env.VUE_APP_ROOT_API,
        APP_URL_LOCAL: process.env.VUE_APP_ROOT_API_LOCAL,
        // Dev State Variable
        launched: false,
        isDebug: false, // Encapsulate console.log with this state
        isMockup: false, // To load data from local JSON
        isLocal: true, // To load data from local endpoint
        // Main App States
        isLoading: false, // Check if data download is ongoing
        isLoadingInsee: false, // Check if data download is ongoing
        activateToolbar: false,
        // DATA App States
        availableAreas: AREAS_JSON, //JSON of all available Areas
        availableNeighbs: NEIGHBS_JSON, //JSON of neigbors per Area
        availableKPIs: KPIS_JSON, //JSON of all available KPIs and their configuration
        lastDataUpdateDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().substr(0, 10),
        // Filter States
        selectedAreaCode: "00", // Area Identifier
        selectedKPI: "Personnes hospitalisées", // KPI Identifier
        selectedDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().substr(0, 10), // Date Identifier
        //Contributors
        contributors: CONTRIBUTORS_JSON, //JSON of all EPIDIA contributors
        // Data Records
        records: [], // Data feeded from action getMainData
        bedRecords: [], // Data feeded from action getBedData
        inseeRecords: [], // Data from INSEE
        predictionRecords: [] // Data from model Predictions
    },
    getters: {
        APP_URL: state => (state.isLocal) ? state.APP_URL_LOCAL : state.APP_URL_PROD, // Single getter for API URL to use
        hasData: state => state.records.length > 0, // Does the records have data
        genderAvailable: state => state.availableKPIs[state.selectedKPI].genderAvailable,
        deathRelated: state => state.availableKPIs[state.selectedKPI].deathRelated,
        selectedAreaName: state => state.availableAreas[state.selectedAreaCode], // Area Name
        selectedArea: (state, getters) => `${state.selectedAreaCode} - ${getters.selectedAreaName}`, // Area Full name
        getNeighbors: (state) => (n) => state.availableNeighbs[state.selectedAreaCode].slice(0, n), // Get the n first neighbors
        selectedDay: state => state.selectedDate.split("-")[2], // Selected Day
        selectedMonth: state => state.selectedDate.split("-")[1], // Selected Month
        selectedYear: state => state.selectedDate.split("-")[0], // Selected Year
        lastDateDay: state => state.lastDataUpdateDate.split("-")[2], // Last Day
        lastDateMonth: state => state.lastDataUpdateDate.split("-")[1], // Last Month
        lastDateYear: state => state.lastDataUpdateDate.split("-")[0], // Last Year
        fullNameAreas: state => Object.entries(state.availableAreas).map(area => `${area[0]} - ${area[1]}`), // Array of available areas with format `<CODE> - <NAME>`
        dateRecords: (state, getters) => { // List of all area records for the selected date
            if (state.selectedAreaCode == "00") {
                // If selected area is whole country
                return getters.hasData ? state.records.filter(r => r.date === state.selectedDate && r.area == "00") : []
            } else {
                // Select records for the selected date
                return getters.hasData ? state.records.filter(r => r.date === state.selectedDate) : []
            }
        },
        areaRecords: (state, getters) => { // List of all date records for the selected date
            return getters.hasData
                ? state.records.filter(r => r.area === state.selectedAreaCode)
                : [];
        },
        selectedRecord: (state, getters) => getters.areaRecords.find(x => x.date === state.selectedDate), // Record for selected date/area filters
        lastAreaRecord: (state, getters) => getters.areaRecords[getters.areaRecords.length - 1].data, // Last element of areaRecords
        menAreaRecord: (state, getters) => { // Records of the selected Area only with Men related data
            if (getters.genderAvailable) {
                return state.records.filter(r => r.area === state.selectedAreaCode).map(r => ({
                    date: r.date,
                    area: r.area,
                    name: state.availableAreas[r.area],
                    data: reduceObject(r.data, ['men'].concat(state.availableKPIs[state.selectedKPI].schema))
                }))
            } else {
                return []
            }
        },
        womenAreaRecord: (state, getters) => {// Records of the selected Area only with Women related data
            if (getters.genderAvailable) {
                return state.records.filter(r => r.area === state.selectedAreaCode).map(r => ({
                    date: r.date,
                    area: r.area,
                    name: state.availableAreas[r.area],
                    data: reduceObject(r.data, ['women'].concat(state.availableKPIs[state.selectedKPI].schema))
                }))
            } else {
                return []
            }
        },
        reducedRecords: state => state.records.map(r => ({ // Records with only the selectedKPI as data
            date: r.date,
            area: r.area,
            name: state.availableAreas[r.area],
            data: reduceObject(r.data, state.availableKPIs[state.selectedKPI].schema)
        })),
        indexRecords: state => state.records.map(r => `${r.date} - ${r.area}`), // Index object as `<date>-<areacode>`
        indexINSEERecords: state => state.inseeRecords.map(r => r.area), // INSEE Index object as `<areacode>`
        maxDateAvailable: (state, getters) => getters.hasData ? getters.areaRecords.map(x => x.date).reduce((a, b) => (a > b) ? a : b) : null, // Get the most recent date available for the selected area
        areaBeds: state => state.bedRecords.find(x => x.code === state.selectedAreaCode), // Single Object with the bed capacities for the selected Area
        inseeAreaRecord: state => (state.inseeRecords.length > 0) ? state.inseeRecords.find(x => x.area === state.selectedAreaCode) : null,
        areaPredictionRecords: state => (state.predictionRecords.filter(x => ((x.area === state.selectedAreaCode) && (x.jour > state.lastDataUpdateDate)) ))
    },
    mutations: {
        setLaunched: function (state) { state.launched = true }, // Modify the launched state
        setLoading: function (state, status) { state.isLoading = status }, // Modify the loading state
        setLoadingInsee: function (state, status) { state.isLoadingInsee = status }, // Modify the loading state
        toggleLoading: function (state) { state.isLoading = !state.isLoading }, // Toggle the launched state
        setLastUpdateDate: function (state, date) { state.lastDataUpdateDate = date }, // Modify the last updated Date
        setDate: function (state, date) { state.selectedDate = date; }, // Modify the Selected Date
        setArea: function (state, areaCode) { state.selectedAreaCode = areaCode; }, // Modify the Selected Area
        setKPI: function (state, kpi) { state.selectedKPI = kpi; }, // Modify the Selected KPI
        pushRecords: function (state, data) { // Add records to the store
            let newRecords = state.records;
            let addRecords = data.filter(r => store.getters.indexRecords.indexOf(`${r.date} - ${r.area}`) === -1);
            state.records = newRecords.concat(addRecords);
        },
        pushInseeRecords: function (state, payload) { // Add records to the store
            let arrayToPush = state.inseeRecords;
            state.inseeRecords = arrayToPush.concat(payload);
        },
        setBedData: function (state, data) { // Modify the bedRecords
            state.bedRecords = data;
        },
        pushPredictionsRecords: function (state, payload) { // Add records to the store
            let arrayToPush = state.predictionRecords;
            state.predictionRecords = arrayToPush.concat(payload);
        }
    },
    actions: {
        getMainData: async function ({ commit, state, getters }) { // Axios GET Call to obtain records
            commit('setLoading', true);
            try {
                let responseArea = await axios.get(
                    `${getters.APP_URL}/api/v2/get/until`, {
                    params: {
                        yyyy: getters.selectedYear,
                        mm: getters.selectedMonth,
                        dd: getters.selectedDay,
                        area: "00"
                    }
                })
                let responseCntry = await axios.get(
                    `${getters.APP_URL}/api/v2/get/country/until`, {
                    params: {
                        yyyy: getters.selectedYear,
                        mm: getters.selectedMonth,
                        dd: getters.selectedDay,
                    }
                })
                commit('pushRecords', responseCntry.data.concat(responseArea.data));
                commit('setLoading', false);
                commit('setLaunched');
            } catch (error) {
                if (state.isDebug) {
                    console.log(error);
                }
                commit('setLoading', false);
            }
        },
        getLastDate: async function ({ commit, state, getters }) {// Axios GET Call to obtain last date available
            try {
                let response = await axios.get(`${getters.APP_URL}/get/last_updated`);
                let lastDate = response.data.last_updated != null
                    ? response.data.last_updated
                    : new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().substr(0, 10);
                commit('setDate', lastDate)
                commit('setLastUpdateDate', lastDate)
            }
            catch (error) {
                if (state.isDebug) {
                    console.log(error);
                }
                let lastDate = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().substr(0, 10);
                commit('setDate', lastDate)
                commit('setLastUpdateDate', lastDate)
            }
        },
        getBedData: async function ({ commit, state, getters }) {// Axios GET Call to obtain bed capacities
            try {
                let response = await axios.get(`${getters.APP_URL}/get/v1/capacity`);
                commit('setBedData', response.data)
            } catch (error) {
                if (state.isDebug) {
                    console.log(error);
                }
            }
        },
        getInseeData: async function ({ commit, state, getters }) {// Axios GET Call to obtain bed capacities
            commit('setLoadingInsee', true);
            if (getters.indexINSEERecords.indexOf(state.selectedAreaCode) === -1) {
                try {
                    let response = await axios.get(`${getters.APP_URL}/api/v1/get/data_insee/all`, {
                        params: {
                            jour: `${getters.selectedYear}-${getters.selectedMonth}-${getters.selectedDay}`,
                            area: state.selectedAreaCode
                        }
                    });
                    let payload = {
                        area: state.selectedAreaCode,
                        data: response.data
                    }
                    commit('pushInseeRecords', payload)
                    commit('setLoadingInsee', false);
                } catch (error) {
                    if (state.isDebug) {
                        console.log(error);
                    }
                    commit('setLoadingInsee', false);
                }
            }
        },
        getPredictions: async function ({ commit, state, getters }) {
            try {
                let response = await axios.get(`${getters.APP_URL}/api/get/from/predictor/${getters.lastDateYear}/${getters.lastDateMonth}/${getters.lastDateDay}/00`)
                let payload = response.data
                commit('pushPredictionsRecords', payload)
            } catch (error) {
                if (state.isDebug) {
                    console.log(error);
                }
            }
        }
    }
})

export default store;