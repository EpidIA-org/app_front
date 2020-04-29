<template>
  <v-tabs
    v-model="tab"
    background-color
    class
    :centered="centered"
    :grow="grow"
    :right="right"
    :prev-icon="prevIcon ? 'mdi-arrow-left-bold-box-outline' : undefined"
    :next-icon="nextIcon ? 'mdi-arrow-right-bold-box-outline' : undefined"
    :icons-and-text="icons"
  >
    <v-tabs-slider></v-tabs-slider>

    <v-tab href="#tab-1">Hosp.</v-tab>
    <v-tab href="#tab-2">Retours.</v-tab>
    <v-tab href="#tab-3">Décès</v-tab>
    <v-tab href="#tab-4">Légende</v-tab>

    <v-tab-item value="tab-1">
      <v-card flat tile>
        <v-card-text>
          Le {{new Date(selectedDate).toLocaleDateString('fr-FR', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}} on recense
          <span
            class="blue--text"
          >{{lastAreaRecord.current.hospital}} personnes</span>
          hospitalisées en {{areaName}}
          (
          <span>{{Math.round(100*lastAreaRecord.men.current.hospital/(lastAreaRecord.men.current.hospital+lastAreaRecord.women.current.hospital))}}% d'hommes, {{Math.round(100*lastAreaRecord.women.current.hospital/(lastAreaRecord.men.current.hospital+lastAreaRecord.women.current.hospital))}}% de femmes</span>)
          dont
          <span>{{lastAreaRecord.new.hospital}} hospitalisations</span> aujourd'hui. Parmi ces cas,
          <span
            class="pink--text"
          >{{lastAreaRecord.current.critical}} personnes</span> sont hospitalisées en réanimation ou soins intensifs
          (
          <span>{{Math.round(100*lastAreaRecord.men.current.critical/(lastAreaRecord.men.current.critical+lastAreaRecord.women.current.critical))}}% d'hommes, {{Math.round(100*lastAreaRecord.women.current.critical/(lastAreaRecord.men.current.critical+lastAreaRecord.women.current.critical))}}% de femmes</span>)
        </v-card-text>
      </v-card>
    </v-tab-item>
    <v-tab-item value="tab-2">
      <v-card flat tile>
        <v-card-text>
          Entre le 18 mars 2020 et le {{new Date(selectedDate).toLocaleDateString('fr-FR', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}},
          <span
            class="green--text"
          >{{lastAreaRecord.total.recoveries}} retours à domicile</span>
          ont eux lieu {{areaName}} dont
          <span
            class="green--text"
          >{{lastAreaRecord.new.recoveries}} nouveaux retours à domicile</span>
          (
          <span>{{Math.round(100*lastAreaRecord.men.total.recoveries/(lastAreaRecord.men.total.recoveries+lastAreaRecord.women.total.recoveries))}}% d'hommes, {{Math.round(100*lastAreaRecord.women.total.recoveries/(lastAreaRecord.men.total.recoveries+lastAreaRecord.women.total.recoveries))}}% de femmes</span>)
          dont
        </v-card-text>
      </v-card>
    </v-tab-item>
    <v-tab-item value="tab-3">
      <v-card flat tile>
        <v-card-text>
          Depuis le 18 mars 2020,
          <span
            class="red--text"
          >{{lastAreaRecord.total.deaths}} décès en hopital</span>
          en {{areaName}} ont été relié au COVID-19 dont
          <span
            class="red--text"
          >{{lastAreaRecord.new.deaths}}</span>
          le {{new Date(selectedDate).toLocaleDateString('fr-FR', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}}
          (
          <span>{{Math.round(100*lastAreaRecord.men.total.deaths/(lastAreaRecord.men.total.deaths+lastAreaRecord.women.total.deaths))}}% d'hommes, {{Math.round(100*lastAreaRecord.women.total.deaths/(lastAreaRecord.men.total.deaths+lastAreaRecord.women.total.deaths))}}% de femmes</span>)
          dont
        </v-card-text>
      </v-card>
    </v-tab-item>
    <v-tab-item value="tab-4">
      <v-card flat tile >
          <v-card-text class="d-flex justify-end">
              <LegendComponent :scaleInterval="intervals" :colorScale="colorMap" />
          </v-card-text>
      </v-card>
    </v-tab-item>
  </v-tabs>
</template>



<script>
import LegendComponent from "./LegendComponent";
export default {
  name: "SummaryCard",
  components: { LegendComponent },
  props: {
    lastAreaRecord: {
      type: Object,
      default: () => ({})
    },
    areaName: {
      type: String,
      default: ""
    },
    selectedDate: {
      type: String,
      default: ""
    },
    colorMap: {
      type: Array,
      default: () => []
    },
    intervals: {
      type: Array,
      default: () => []
    }
  },

  data: () => ({
    tab: null,
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    icons: false,
    centered: false,
    grow: false,
    vertical: false,
    prevIcon: false,
    nextIcon: false,
    right: false,
    tabs: 1
  }),
  created: function() {},
  mounted: function() {},

  computed: {},
  watch: {},
  methods: {}
};
</script>


<style>
</style>





