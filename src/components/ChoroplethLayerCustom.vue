<template>
  <div>
    <l-geo-json
      v-if="renderComponent"
      :geojson="geojsonData.geojson"
      :options="geojsonOptions"
      ref="geolayer"
    ></l-geo-json>
    <slot :currentItem="currentItem" :unit="value.metric" :min="min" :max="max"></slot>
  </div>
</template>
<script>
import { LGeoJson } from "vue2-leaflet";
import L from "leaflet";
import { getMin, getMax, validNumber } from "../utils.js";
function mouseover({ target }) {
  target.setStyle({
    weight: this.currentStrokeWidth,
    color:
      target.feature.properties[this.geojsonIdKey] === this.selectedAreaCode
        ? `#${this.activeStrokeColor}`
        : `#${this.currentStrokeColor}`,
    dashArray: ""
  });
  if (!L.Browser.ie && !L.Browser.opera) {
    target.bringToFront();
  }
  let geojsonItem = target.feature.properties;
  let item = this.geojsonData.data.find(
    x => x[this.idKey] == geojsonItem[this.geojsonIdKey]
  );
  if (!item) {
    this.currentItem = { name: "", value: 0 };
    return;
  }
  let tempItem = { name: item[this.titleKey], value: item[this.value.key] };
  if (this.extraValues) {
    let tempValues = [];
    for (let x of this.extraValues) {
      tempValues.push({
        value: item[x.key],
        metric: x.metric
      });
    }
    tempItem = { ...tempItem, extraValues: tempValues };
  }
  this.currentItem = tempItem;
}
function mouseout({ target }) {
  if (
    !L.Browser.ie &&
    !L.Browser.opera &&
    target.feature.properties[this.geojsonIdKey] === this.selectedAreaCode
  ) {
    target.bringToFront();
  }
  let geojsonId = target.feature.properties[this.geojsonIdKey];
  target.setStyle({
    weight: this.getStroke(geojsonId, true),
    color: this.getColor(geojsonId, true),
    dashArray: this.getDash(geojsonId, true)
  });
  this.currentItem = { name: "", value: 0 };
}
export default {
  name: "ChoroplethLayer",
  props: {
    geojson: Object,
    data: Array,
    center: Array,
    colorScale: Array,
    intervals: Array,
    titleKey: String,
    idKey: String,
    value: Object,
    extraValues: Array,
    geojsonIdKey: String,
    mapStyle: Object,
    zoom: Number,
    mapOptions: Object,
    neighbors: { type: Array, default: () => [] },
    strokeColor: { type: String, default: "fff" },
    currentStrokeColor: { type: String, default: "666" },
    activeStrokeColor: { type: String, default: "666" },
    strokeWidth: { type: Number, default: 1 },
    currentStrokeWidth: { type: Number, default: 5 },
    activeStrokeWidth: { type: Number, default: 3 },
    selectedAreaCode: { type: String, default: "00" }
  },
  mounted() {
    if (this.$parent._isMounted) {
      this.deferredMountedTo(this.$parent.mapObject);
    }
  },
  watch: {
    selectedAreaCode: function() {
      this.refreshLayer();
    }
  },
  data() {
    return {
      currentItem: { name: "", value: 0 },
      renderComponent: true
    };
  },
  computed: {
    min() {
      return getMin(this.geojsonData.data, this.value.key);
    },
    max() {
      return getMax(this.geojsonData.data, this.value.key);
    },
    geojsonData() {
      return { geojson: { ...this.geojson }, data: this.data };
    },
    geojsonOptions: function() {
      return {
        style: feature => {
          let itemGeoJSONID = feature.properties[this.geojsonIdKey];
          //   let color = "NONE";
          const { data } = this.geojsonData;
          let item = data.find(x => x[this.idKey] == itemGeoJSONID);
          if (!item) {
            return {
              color: "white",
              weight: this.strokeWidth
            };
          }
          let valueParam = Number(item[this.value.key]);
          if (!validNumber(valueParam)) {
            return {
              color: "white",
              weight: this.strokeWidth
            };
          }
          //   const { min, max } = this;
          return {
            weight: item ? this.getStroke(item[this.idKey]) : this.strokeWidth,
            opacity: 1,
            color: item ? this.getColor(item[this.idKey]) : this.strokeColor,
            dashArray: item ? this.getDash(item[this.idKey]) : "3",
            fillOpacity: 0.7,
            fillColor: this.getColorFromIntervals(valueParam)
          };
        },
        onEachFeature: (feature, layer) => {
          layer.on({
            mouseover: mouseover.bind(this),
            mouseout: mouseout.bind(this),
            click: function({ target }) {
              //   console.log(target.feature);
              this.$emit("clickFeat", target.feature);
              this.refreshLayer();
            }.bind(this)
          });
        }
      };
    }
  },
  components: {
    LGeoJson
  },
  methods: {
    deferredMountedTo(parent) {
      this.parent = parent;
      for (var i = 0; i < this.$children.length; i++) {
        if (typeof this.$children[i].deferredMountedTo === "function") {
          this.$children[i].deferredMountedTo(parent);
        }
      }
    },
    findInterval: function(value) {
      return this.intervals.findIndex(el => el.min <= value && el.max >= value);
    },
    getColorFromIntervals: function(d) {
      return this.colorScale[this.findInterval(d)];
    },
    refreshLayer: function() {
      this.renderComponent = false;

      this.$nextTick(() => {
        // Add the component back in
        this.renderComponent = true;
      });
    },
    generateStyle: function(geojsonId) {
      let stroke = "";
      let dash = "";
      let color = "";
      if (geojsonId === this.selectedAreaCode) {
        stroke = this.activeStrokeWidth;
        color = `#${this.activeStrokeColor}`;
        dash = "";
      } else if (this.neighbors.findIndex(geojsonId) > -1) {
        stroke = this.activeStrokeWidth;
        color = `#000`;
        dash = "";
      } else {
        stroke = this.strokeWidth;
        color = `#${this.strokeColor}`;
        dash = "3";
      }
      return {
        weight: stroke,
        color: color,
        dashArray: dash
      };
    },
    getColor: function(geojsonId) {
      return geojsonId === this.selectedAreaCode
        ? `#${this.activeStrokeColor}`
        : this.neighbors.indexOf(geojsonId) > -1
        ? "#546E7A"
        : `#${this.strokeColor}`;
    },
    getStroke: function(geojsonId) {
      return geojsonId === this.selectedAreaCode
        ? this.activeStrokeWidth
        : this.neighbors.indexOf(geojsonId) > -1
        ? this.activeStrokeWidth - 1
        : this.strokeWidth;
    },
    getDash: function(geojsonId) {
      return geojsonId === this.selectedAreaCode
        ? ""
        : this.neighbors.indexOf(geojsonId) > -1
        ? ""
        : "3";
    }
  }
};
</script>