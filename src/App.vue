<template>
  <!-- START VUETIFY APP -->
  <v-app id="covidiapp">
    <!-- RIGHT PANEL -->
    <Drawer v-model="drawer" />
    <header>
      <!-- MAIN TOOLBAR -->
      <AppBar @toggleDrawer="drawer = !drawer" />
    </header>
    <!-- MAIN APP FEATURES -->
    <main>
      <v-container class="content mr-a">
        <!-- FIRST ROW - KPI CARDS & AREA SELECTION -->
        <v-row class="first-row">
          <!-- AutoComplete Selection -->
          <v-col offset-sm="2" offset-md="0" cols="12" sm="8" md="4">
            <AreaSelector :areas="availableAreas" v-model="selectedArea" />
          </v-col>
          <v-col offset-sm="3" offset-md="0" sm="6" md="8" style="padding-top:0">
            <!-- MAIN KPIS -->
            <v-row>
              <!-- KPI Cards -->
              <v-col cols="12" md="4">
                <KPICard
                  v-if="hasData"
                  key="hospital"
                  title="Hospitalisations"
                  color="blue"
                  :data="objectForKPICard.data"
                  :isLoading="isLoading"
                  :hoverMsg="hoverMsgDeathCard"
                />
              </v-col>
              <v-col cols="12" md="4" class>
                <KPICard
                  v-if="hasData"
                  key="recoveries"
                  title="Retours à domicile"
                  color="green"
                  :data="objectForKPICard.data"
                  :isLoading="isLoading"
                  :hoverMsg="hoverMsgDeathCard"
                />
              </v-col>
              <v-col cols="12" md="4" class>
                <KPICard
                  v-if="hasData"
                  key="deaths"
                  title="Décès"
                  color="red"
                  :data="objectForKPICard.data"
                  :isLoading="isLoading"
                  :hoverMsg="hoverMsgDeathCard"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <!-- HELPER ROW ON UPDATED DATA DATE -->
        <v-row class="text-right">
          <v-col
            cols="12"
            v-if="lastUpdated != null"
            style="padding:0;font-style:italic;font-weight:300"
          >Dernière mise à jour des données: {{lastUpdated}}</v-col>
        </v-row>
        <hr />
        <!-- FILTER ROW - Date & KPI -->
        <v-row class="second-row" v-if="hasData">
          <!-- Date Selection -->
          <v-col offset-sm="2" offset-md="0" cols="12" sm="8" md="6">
            <DateSelector v-model.lazy="selectedDate" :maxDateAllowed="lastUpdated" />
          </v-col>
          <v-col offset-sm="2" offset-md="0" cols="12" sm="8" md="6">
            <!-- KPI Selection -->
            <KPISelector v-model="selectedKPI" :choices="availableKPIs" />
          </v-col>
        </v-row>
        <!-- DEBUG ROW -->
        <v-row v-if="isDebug">
          <v-col>Area: {{selectedArea}}</v-col>
          <v-col>Date: {{selectedDate}}</v-col>
          <v-col>KPI: {{selectedKPI}}</v-col>
        </v-row>
        <!-- VISUALIZATION ROW -->
        <v-row class="third-row" v-if="hasData">
          <!-- MAP & SUMMARY -->
          <v-col cols="12" md="6" class>
            <v-card :loading="isLoading">
              <v-card-title
                style="word-break: break-word;"
              >Les chiffres en {{selectedAreaName}} du {{new Date(selectedDate).toLocaleDateString('fr-FR', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}}</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="12" lg="6">
                    <SummaryCard
                      :lastAreaRecord="selectedRecord.data"
                      :areaName="selectedAreaName"
                      :selectedDate="selectedDate"
                      :colorMap="availableKPIs[selectedKPI].colorScale"
                      :intervals="scaleInterval"
                    />
                  </v-col>
                  <v-col cols="12" md="12" lg="6">
                    <MapCard
                      :isLoading="isLoading"
                      :selectedKPI="selectedKPI"
                      :areaData="objectForMapComponent"
                      :colorMap="availableKPIs[selectedKPI].colorScale"
                      :intervals="scaleInterval"
                      :selectedArea="selectedAreaName"
                      :selectedDate="selectedDate"
                      :selectedAreaCode="selectedAreaCode"
                      @changeZone="$store.commit('setArea',$event.properties.code)"
                      :neighbors="neighbors[selectedAreaCode].slice(0,3)"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <!-- CHART GROWTH & VALUE -->
          <v-col cols="12" md="6" v-if="hasData">
            <BarChartCard
              :isLoading="isLoading"
              :reducedRecord="objectForBarChart"
              :selectedKPI="selectedKPI"
              :selectedArea="selectedAreaName"
              :color="availableKPIs[selectedKPI].colorScale[5]"
              :lastDate="maxDateAvailable"
            />
          </v-col>
          <!-- NEIGHBORS HEATMAP -->
          <v-col cols="12" md="6" class>
            <HeatmapCard
              v-if="hasData"
              :selectedKPI="selectedKPI"
              :isLoading="isLoading"
              :kpiArray="objectForHeatmapComponent"
              :nDays="daysForHeatmap"
              :colorMap="availableKPIs[selectedKPI].colorScale"
              :intervals="scaleInterval"
              :lastDate="new Date(this.selectedDate)"
            />
          </v-col>
          <!-- MEN/WOMEN PROPORTION AREA CHART -->
          <v-col cols="12" md="6" v-if="hasData && genderAvailable">
            <ProportionChartCard
              v-if="genderAvailable"
              :isLoading="isLoading"
              :womenReducedRecord="womenAreaRecord"
              :menReducedRecord="menAreaRecord"
              :selectedKPI="selectedKPI"
              :selectedArea="selectedAreaName"
              :colorMen="availableKPIs[selectedKPI].colorScale[5]"
              :colorWomen="availableKPIs[selectedKPI].colorScale[2]"
              :lastDate="maxDateAvailable"
            />
          </v-col>
          <!-- BED SATURATION CARD -->
          <v-col cols="12" md="6" v-if="hasData">
            <SaturationCard
              :status="objectForSaturationCard"
              :maximum="areaBeds"
              :selectedDate="selectedDate"
            />
          </v-col>
          <!-- INSEE DEATH CARD -->
          <v-col cols="12" md="6" v-if="hasData && deathRelated">
            <InseeCard
              v-if="!isLoadingInsee"
              :selectedArea="selectedAreaName"
              :isLoading="isLoading"
            />
          </v-col>
        </v-row>
      </v-container>
    </main>
    <!-- WIP TOOLBAR IN CASE OF SCROLLING - NOT FUNCTIONAL -->
    <FilterToolbar v-if="activateToolbar && hasData" @setDate="selectedDate = $event" />
  </v-app>
</template>


<script>
// Needed imports
import Vue from "vue";
import { mapState, mapGetters, mapActions } from "vuex";
import KPICard from "./components/KPICard";
import AreaSelector from "./components/AreaSelector";
import DateSelector from "./components/DateSelector";
import SummaryCard from "./components/SummaryCard";
import KPISelector from "./components/KPISelector";
import MapCard from "./components/MapCard";
import HeatmapCard from "./components/HeatmapCard";
import AppBar from "./components/AppBar";
import Drawer from "./components/Drawer";
import SaturationCard from "./components/SaturationCard";
import BarChartCard from "./components/BarChartCard";
import InseeCard from "./components/InseeCard";
import ProportionChartCard from "./components/ProportionChartCard";
import FilterToolbar from "./components/FilterToolbar";
import axios from "axios";
import { daysBetween, getQuantileFromArray, reduceObject } from "./utils";

// Prototype axios as Vue property
Vue.prototype.$http = axios;

// Define App
export default {
  name: "App", // App Name
  components: {
    // Components dependency
    AppBar,
    Drawer,
    KPICard,
    AreaSelector,
    DateSelector,
    KPISelector,
    SummaryCard,
    MapCard,
    HeatmapCard,
    SaturationCard,
    BarChartCard,
    ProportionChartCard,
    FilterToolbar,
    InseeCard
  },

  data: () => ({
    // Configuration Variables
    daysForHeatmap: 8, // Number of days to show on heatmap
    drawer: false // Right Panel <show> state
  }),
  created: function() {},
  mounted: async function() {
    // Function to launch when Component is ready
    if (this.isMockup) {
      // MOCKUP STATE IS DEPRECATED
      //   this.records = MOCKUP_JSON;
    } else {
      this.getLastDate(); // Get Last available date
      this.$store.commit("setDate", this.lastUpdated)
      this.getBedData(); // Get bed capacities
      this.getInseeData(); // Get Insee Data
      this.getMainData(); // Get records
      
    }
  },

  computed: {
    // States from Store
    ...mapState({
      isDebug: "isDebug",
      isMockup: "isMockup",
      isLocal: "isLocal",
      isLoading: "isLoading",
      isLoadingInsee: "isLoadingInsee",
      activateToolbar:"activateToolbar",
      areas: "availableAreas",
      neighbors: "availableNeighbs",
      availableKPIs: "availableKPIs",
      lastUpdated: "lastDataUpdateDate",
      selectedDate: "selectedDate",
      records: "records"
    }),
    // Getters from Store
    ...mapGetters({
      selectedArea: "selectedArea",
      hasData: "hasData",
      genderAvailable: "genderAvailable",
      availableAreas: "fullNameAreas",
      selectedAreaName: "selectedAreaName",
      selectedDay: "selectedDay",
      selectedMonth: "selectedMonth",
      selectedYear: "selectedYear",
      dateRecord: "dateRecords",
      areaRecord: "areaRecords",
      menAreaRecord: "menAreaRecord",
      womenAreaRecord: "womenAreaRecord",
      selectedRecord: "selectedRecord",
      reducedRecord: "reducedRecords",
      maxDateAvailable: "maxDateAvailable",
      recordItemsIndices: "indexRecords",
      areaBeds: "areaBeds",
      deathRelated: "deathRelated"
    }),
    // Specific from Store
    // Needed because of v-model in some component
    selectedKPI: {
      get() {
        return this.$store.state.selectedKPI;
      },
      set(value) {
        return this.$store.commit("setKPI", value);
      }
    },
    selectedDate: {
      get() {
        return this.$store.state.selectedDate;
      },
      set(value) {
        return this.$store.commit("setDate", value);
      }
    },
    selectedArea: {
      get() {
        return this.$store.getters.selectedArea;
      },
      set(value) {
        return this.$store.commit("setArea", value.split(" - ")[0]);
      }
    },
    selectedAreaCode: {
      get() {
        return this.$store.state.selectedAreaCode;
      },
      set(value) {
        return this.$store.commit("setArea", value);
      }
    },
    // Format Data for KPICard
    objectForKPICard: function() {
      // Get the last available date for the selected area
      // KPIs CARD only show the most recent figures
      // Not affected by SelectedDate
      return this.areaRecord.filter(x => x.date === this.maxDateAvailable)[0];
    },
    // Format Data for BarChart
    objectForBarChart: function() {
      // Reduce the selected records to show only the needed value
      return this.areaRecord.map(x => ({
        date: x.date,
        data: reduceObject(x.data, this.availableKPIs[this.selectedKPI].schema)
      }));
    },
    // Format Data for HeatMapComponent
    objectForHeatmapComponent: function() {
      // Cast the selectedDate as DATE
      let dateStamp = new Date(this.selectedDate);
      if (this.selectedAreaCode == "00") {
        // Specific Case of Global Country
        return this.reducedRecord
          .filter(
            // Filter only elements...
            x =>
              new Date(x.date) <= dateStamp && // ...where date is between selected date and <daysForHeatmap> before
              daysBetween(new Date(x.date), dateStamp) <=
                this.daysForHeatmap - 1 &&
              (x.area === this.selectedAreaCode ||
                this.neighbors[this.selectedAreaCode]
                  .slice(0, 2)
                  .indexOf(x.area) > -1)
          )
          .map(x => ({
            // Once filtered add the Area name to the objects with the `dep`key
            dep: this.areas[x.area],
            d: x.date,
            v: x.data
          }));
      } else {
        // Generic Case
        return this.reducedRecord // From the reducedRecord
          .filter(
            // Filter only elements...
            x =>
              new Date(x.date) <= dateStamp && // ...where date is between selected date and <daysForHeatmap> before
              daysBetween(new Date(x.date), dateStamp) <=
                this.daysForHeatmap - 1 &&
              (x.area === this.selectedAreaCode || //...and where the area code is the selectedArea or Neighbors
                this.neighbors[this.selectedAreaCode]
                  .slice(0, 2)
                  .indexOf(x.area) > -1)
          )
          .map(x => ({
            // Once filtered add the Area name to the objects with the `dep`key
            dep: this.areas[x.area],
            d: x.date,
            v: x.data
          }));
      }
    },
    // Format Data for MapComponent
    objectForMapComponent: function() {
      return this.reducedRecord
        .filter(x => x.date === this.selectedDate && x.area != "00") // Filter areas where date is selectedDate execpt for whole Country
        .map(x => ({
          // Map Each object to the following format
          date: x.date,
          area: x.area,
          data: x.data,
          name: this.areas[x.area]
        }));
    },
    // Format For Saturation Card
    objectForSaturationCard: function() {
      return this.areaRecord.find(x => x.date === this.selectedDate);
    },
    // Compute Intervals for HeatMapComponent
    scaleInterval: function() {
      let values = this.objectForMapComponent.map(x => x.data);
      return getQuantileFromArray(values);
    },
    hoverMsgDeathCard: function() {
      return this.selectedAreaCode !== "00"
        ? "Les chiffres affichés ne comprennent pas les cas en EHPAD mais uniquement les données des hopitaux"
        : "Les chiffres affichés ne comprennent pas les cas en EHPAD mais uniquement les données des hopitaux";
    }
  },
  watch: {
    // Cache in front to avoid same API calls
    selectedArea: function() {
      // NOTHING TO LAUNCH
      //   this.validateCall(this.selectedDate, val);
      this.getInseeData();
    },
    selectedDate: function() {
      // When selectedDate is modified launch validate Call
      this.validateCall();
    }
  },
  methods: {
    ...mapActions(["getMainData", "getLastDate", "getBedData", "getInseeData"]),
    validateCall: function() {
      // Cache Function
      // CACHE NOT IMPLEMENTED IN FRONT
      this.getMainData(); // Launch getMainDate
    }
  }
};
</script>


<style>
#covidiapp {
  background: #f4f4f8;
}
.content {
  min-height: 100%;
  margin-left: 2% !important;
  margin-right: 2% !important;
  width: 96%;
  min-width: 96%;
}

.mdi:before,
.mdi-set {
  /* color: #5792ec; */
}

.first-row {
  /* min-height: 30%; */
}
.second-row {
}
.third-row {
}

hr {
  color: #d9d9d9;
}

main {
  /* padding-top: 0px;
  min-height: 80%; */
}
footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  min-height: 5%;
}
</style>