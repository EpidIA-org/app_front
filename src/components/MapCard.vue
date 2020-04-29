<template>
  <l-map
    class="v-card"
    :center="center"
    :maxBounds="maxBounds"
    :zoom="zoom"
    :minZoom="minZoom"
    :maxZoom="maxZoom"
    style="height: 300px;width:100%;background:white;"
    :options="mapOptions"
    @l-ready="delayedUIColors"
    ref="mapref"
  >
    <l-choropleth-layer
      :data="areaData"
      titleKey="name"
      idKey="area"
      :value="value"
      geojsonIdKey="code"
      :geojson="geojson"
      :colorScale="colorMap"
      :min="intervals[0].min"
      :max="intervals[intervals.length - 1].min"
      :currentStrokeColor="currentStrokeColor"
      :activeStrokeColor="activeStrokeColor"
      :strokeColor="strokeColor"
      :intervals="intervals"
      :selectedAreaCode="selectedAreaCode"
      ref="choroplethref"
      v-on:clickFeat="$emit('changeZone', $event)"
      :neighbors="neighbors"
    >
      <template slot-scope="props">
        <l-info-control
          v-if="false"
          :item="props.currentItem"
          :unit="props.unit"
          @update:currentItem="handleUIColors"
          title="Départment"
          placeholder="Sélectionner un département"
        />
        <l-reference-chart
          v-if="false"
          title="Echelle"
          :colorScale="colorMap"
          :min="intervals[0].min"
          :max="intervals[intervals.length - 1].min"
          position="topright"
        />
      </template>
    </l-choropleth-layer>
  </l-map>
</template>
<script>
import { LMap } from "vue2-leaflet";
import { InfoControl, ReferenceChart } from "vue-choropleth"; //,ReferenceChart
import ChoroplethLayer from "./ChoroplethLayerCustom";
import MOCKUP_GEOJSON from "../data/departements.json";

export default {
  name: "MapCard",
  components: {
    LMap,
    "l-info-control": InfoControl,
    "l-reference-chart": ReferenceChart,
    "l-choropleth-layer": ChoroplethLayer
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    neighbors: {
      type: Array,
      default: () => []
    },
    areaData: {
      type: Array,
      default: () => []
    },
    selectedKPI: {
      type: String,
      default: "NONE"
    },
    colorMap: {
      type: Array,
      default: () => [
        "FFEBEE",
        "#FFCDD2",
        "#EF9A9A",
        "#EF5350",
        "#D32F2F",
        "#C62828",
        "#B71C1C"
      ]
    },
    intervals: {
      type: Array,
      default: () => [
        { min: 0, max: 10 },
        { min: 11, max: 20 },
        { min: 21, max: 30 },
        { min: 31, max: 40 },
        { min: 41, max: 50 },
        { min: 51, max: 60 },
        { min: 61, max: 100000 }
      ]
    },
    selectedArea: {
      type: String,
      defalut: "AREA_NAME"
    },
    selectedAreaCode: {
      type: String,
      defalut: "00"
    },
    selectedDate: {
      type: String,
      defalut: "AREA_NAME"
    }
  },

  data: () => ({
    extraValues: [
      {
        key: "amount_m",
        metric: "% boys"
      }
    ],
    sample: null,
    center: [46.8601, 2.1971],
    maxBounds: [
      [41.15, -9.86],
      [51.56, 10.38]
    ],
    zoom: 5,
    minZoom: 5,
    maxZoom: 7,
    mapOptions: {
      attributionControl: false
    },
    activeStrokeColor: "5792EC",
    currentStrokeColor: "FED766", //,"5792EC",
    strokeColor: "FED766",
    geojson: MOCKUP_GEOJSON
  }),

  computed: {
    value: function() {
      return {
        key: "data",
        metric: this.selectedKPI
      };
    }
  },

  watch: {},
  mounted: function() {
    this.delayedUIColors();
  },

  methods: {
    handleUIColors: function() {
      let query = document.querySelectorAll(".info.leaflet-control");
      for (let i = 0; i < query.length; i++) {
        query[i].setAttribute(
          "style",
          "background-color: hsla(0,0%,100%,.8)!important; border-color: background: hsla(0,0%,100%,.8)!important;font-weight: 200;"
        );
      }
      query = document.querySelectorAll(".info.leaflet-control h4");
      for (let i = 0; i < query.length; i++) {
        query[i].setAttribute(
          "style",
          'font-family: "Roboto", sans-serif;font-weight: 300'
        );
      }
      query = document.querySelectorAll(".info.leaflet-control b");
      for (let i = 0; i < query.length; i++) {
        query[i].setAttribute(
          "style",
          'font-family: "Roboto", sans-serif;font-weight: 200'
        );
      }
    },
    delayedUIColors: function() {
      setTimeout(this.handleUIColors, 1500);
    },
    consoleReader: function(val) {
      console.log(val);
    }
  }
};
</script>


<style>
@import "../../node_modules/leaflet/dist/leaflet.css";
.info {
  background-color: white !important;
  border-color: white !important;
}
#map {
  background-color: white;
}

.leaflet-bottom,
.leaflet-top {
  z-index: 6 !important;
}

.leaflet-pane {
  z-index: 5 !important;
}
</style>