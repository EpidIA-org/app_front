<template>
  <v-card :loading="isLoading" :style="colorRootClass" min-height="100%">
    <v-card-title style="word-break: break-word;">Voisinage des {{selectedKPI}} jusqu'au {{new Date(lastDate).toLocaleDateString('fr-FR', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}}</v-card-title>
    <!-- <v-card-subtitle>SUBTITLE</v-card-subtitle> -->
    <v-card-text>
        <v-row>
      <v-col cols="12">Le tableau suivant récapitule la situation des {{selectedKPI}}, jour par jour jusqu'au {{new Date(lastDate).toLocaleDateString('fr-FR', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}}, dans le département selectionné ainsi que ses plus proches voisins.</v-col>
      <v-col cols="12">
        <div id="HeatmapGrid">
          <div id="HeatmapMonth" style="display: flex; font-weight: bold;">
            <div class="hMapT">Mois</div>
            <div
              v-for="(f, m) in monthFrames"
              :key="m"
              :class="'v-card '+'hMap'+(m%2 +1)"
              :style="'font-weight:bold;color:black;width:300px;flex:'+f"
            >{{months[m]}}</div>
          </div>
          <div id="HeatmapDay" style="display: flex; font-weight: bold;" class="pt-1">
            <div class="hMapT">Jour</div>
            <div
              v-for="(d, i) in dateToDisplay"
              :key="d.toISOString().slice(0,10)"
              :class="['v-card','hMap', 'hMap'+(i%2+1)]"
            >{{d.getDate()}}</div>
          </div>
          <div
            v-for="(area, i) in uniqueArea"
            :key="area"
            :id="'HeatmapArea'+i"
            :class="['divArea', (i === 0)?'pt-3':'']"
          >
            <div class="hMapT">{{area}}</div>
            <v-tooltip bottom v-for="(d, k) in dateToDisplay" :key="area+k">
              <template v-slot:activator="{ on }">
                <div
                  v-on="on"
                  :class="['v-card', 'hMap', 'hMap'+findInterval((getElemValue(area, d)))]"
                  :elevation="findInterval(getElemValue(area, d))"
                >{{getElemIndex(area, d)>-1? formatNumber(getElemValue(area, d), 1): '-'}}</div>
              </template>
              <span v-if="3*getElemIndex(area, d)>-1">
                <h3>{{area}} - {{d.toISOString().slice(0,10)}}</h3>
                <h4>{{selectedKPI}}: {{kpiArray[getElemIndex(area, d)].v}}</h4>
              </span>
              <span v-else>Aucune donnée</span>
            </v-tooltip>
          </div>
          <div id="HeatmapLegend" class="pt-2" style="display: flex; font-weight: bold;">
            <div class="hMapT" style="font-height:bold">Legend</div>
            <div v-for="(range, i) in intervals" :key="i" :class="'v-card hMapL hMap'+i">
              {{
              (i===0)?('&lt;' + range.max):((i===intervals.length-1)?('&gt;' + range.min):[range.min, range.max].join('-'))
              }}
            </div>
          </div>
        </div>
      </v-col>
      </v-row>

      <div v-if="false" id="divHeatMap"></div>
    </v-card-text>
  </v-card>
</template>


<script>
window.jQuery = require("jquery");
var $ = window.jQuery;

export default {
  name: "HeatmapCard",
  components: {},

  // Incoming Data from Parent Component
  props: {
    selectedKPI: {
      type: String,
      default: "NONE"
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    lastDate: {
      type: Date,
      default: new Date()
    },
    nDays: {
      type: Number,
      default: 5
    },
    kpiArray: {
      type: Array,
      default: () => []
    },
    months: {
      type: Array,
      default: () => [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre"
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
    textMap: {
      type: Array,
      default: () => [
        "black",
        "black",
        "black",
        "black",
        "black",
        "white",
        "white"
      ]
    }
  },

  // Component Data
  data: () => ({}),

  // Component Data computed on the fly
  computed: {
    colorNText: function() {
      return this.colorMap.map((x, i) => [this.colorMap[i], this.textMap[i]]);
    },
    lastDateMinusOne: function() {
      var strdt = this.lastDate.toISOString().slice(0, 10);
      var dt = new Date(strdt);
      dt.setDate(dt.getDate() - 1);
      return dt;
    },
    dateToDisplay: function() {
      let arrayDates = [];
      for (let i = 0; i < this.nDays; i++) {
        let d = new Date(this.lastDate.toISOString().slice(0, 10));
        d.setDate(d.getDate() - i);
        arrayDates.push(d);
      }
      return arrayDates.sort((a, b) => a - b);
    },
    monthFrames: function() {
      let frameObject = {};
      for (let i = 0; i < this.dateToDisplay.length; i++) {
        let m = this.dateToDisplay[i].getMonth();
        if (m in frameObject) {
          frameObject[m]++;
        } else {
          frameObject[m] = 1;
        }
      }
      return frameObject;
    },
    monthToDisplay: function() {
      return Object.keys(this.monthFrames).map(x => this.months[x]);
    },
    colorRootClass: function() {
      return Object.assign(
        {},
        ...this.colorNText.map((object, id) => ({
          ["--color-map-" + id]: object[0],
          ["--color-map-text-" + id]: object[1]
        }))
      );
    },
    uniqueArea: function() {
      return this.kpiArray
        .map(x => x.dep)
        .filter((x, i, a) => a.indexOf(x) === i);
    },
    computedLegend: function() {
      //LEGEND
      var dLeg = '<div class="hMapT" style="font-height:bold">Legend</div>';
      dLeg +=
        '<div class="hMapL hMap0">' + "&lt;" + this.intervals[0].max + "</div>";
      for (let i = 1; i < this.intervals.length - 1; i++) {
        dLeg +=
          '<div class="hMapL hMap' +
          i +
          '">' +
          this.intervals[i].min +
          "-" +
          this.intervals[i].max +
          "</div>";
      }
      dLeg +=
        '<div class="hMapL hMap' +
        (this.intervals.length - 1) +
        '">&gt;' +
        this.intervals[this.intervals.length - 1].min +
        "</div>";
      return dLeg;
    }
  },

  // Listener to launch when watched variable change
  watch: {
    kpiArray: function() {
      //   this.clearGraph();
      this.displayGraph();
    },
    lastDateMinusOne: function() {
      // this.clearGraph();
      this.displayGraph();
    }
  },
  // Function launched when the Component is mounted on the DOM
  mounted: function() {
    // this.displayGraph();
  },

  // Component Method
  methods: {
    displayGraph: function() {
      var dateToday = this.lastDate;
      dateToday.setDate(dateToday.getDate() - this.nDays);
      const nDeps = this.uniqueArea.length;

      //DATE HEADER
      var heatMonths = "";
      var heatDays = "";
      //CALENDAR
      var hMap = this.uniqueArea.map(x => '<div class="hMapT">' + x + "</div>");
      var lastMonth = null;
      var nDays = 0;

      for (let i = 0; i < this.nDays; i++) {
        dateToday.setDate(dateToday.getDate() + 1);
        let m = dateToday.getMonth();

        if (m == lastMonth || lastMonth == null) {
          nDays++;
          lastMonth = m;
        } else {
          if (nDays == 1)
            heatMonths +=
              '<div class="hMap0" style="font-weight:bold;color:black;width:' +
              nDays * 50 +
              'px">' +
              this.months[lastMonth].substr(0, 3) +
              "</div>";
          else
            heatMonths +=
              '<div class="hMap0" style="font-weight:bold;color:black;width:' +
              nDays * 50 +
              'px">' +
              this.months[lastMonth] +
              "</div>";
          nDays = 1;
          lastMonth = m;
        }
        heatDays += '<div class="hMap hMap0">' + dateToday.getDate() + "</div>";
        let dateTodayISO = dateToday.toISOString().substring(0, 10);
        //MAIN DATA
        for (let f = 0; f < nDeps; f++) {
          let r = this.kpiArray.find(
            el => el.dep == this.uniqueArea[f] && el.d == dateTodayISO
          );
          if (r) {
            var n = r.v;
            var nStr = this.formatNumber(r.v, 1);
            var ind = this.intervals.findIndex(
              el => el.min <= n && el.max >= n
            );
            hMap[f] += `<div class="hMap hMap${ind}">${nStr}</div>`;
          } else hMap[f] += `<div class="hMap"></div>`;
        }
      }
      if (nDays == 1)
        heatMonths +=
          '<div class="hMap1" style="font-weight:bold;color:black;width:' +
          nDays * 50 +
          'px">' +
          this.months[lastMonth].substr(0, 3) +
          "</div>";
      else
        heatMonths +=
          '<div class="hMap1" style="font-weight:bold;color:black;width:' +
          nDays * 50 +
          'px">' +
          this.months[lastMonth] +
          "</div>";
      //LEGEND
      var dLeg = '<div class="hMapT" style="font-height:bold">Legend</div>';
      dLeg +=
        '<div class="hMapL hMap0">' + "&lt;" + this.intervals[0].max + "</div>";
      for (let i = 1; i < this.intervals.length - 1; i++) {
        dLeg +=
          '<div class="hMapL hMap' +
          i +
          '">' +
          this.intervals[i].min +
          "-" +
          this.intervals[i].max +
          "</div>";
      }
      dLeg +=
        '<div class="hMapL hMap' +
        (this.intervals.length - 1) +
        '">&gt;' +
        this.intervals[this.intervals.length - 1].min +
        "</div>";

      var sH = `
        <div id="divHeatMapMonth"><div class="hMapT">Mois</div>${heatMonths}</div>
        <div id="divHeatMapDay"><div class="hMapT">Jour</div>${heatDays}</div>`;
      for (let f = 0; f < nDeps; f++) {
        sH += `<div id="divDpt${f}">` + hMap[f] + "</div>";
      }

      sH += `<div id="divLegend">${dLeg}</div>`;
      $("#divHeatMap").html(sH);
    },
    displayLegend: function() {
      //LEGEND
      var dLeg = '<div class="hMapT" style="font-height:bold">Legend</div>';
      dLeg +=
        '<div class="hMapL hMap0">' + "&lt;" + this.intervals[0].max + "</div>";
      for (let i = 1; i < this.intervals.length - 1; i++) {
        dLeg +=
          '<div class="hMapL hMap' +
          i +
          '">' +
          this.intervals[i].min +
          "-" +
          this.intervals[i].max +
          "</div>";
      }
      dLeg +=
        '<div class="hMapL hMap' +
        (this.intervals.length - 1) +
        '">&gt;' +
        this.intervals[this.intervals.length - 1].min +
        "</div>";
      return dLeg;
    },
    clearGraph: function() {
      $("#divHeatMap").html("");
    },
    formatNumber: function(num, digits) {
      var si = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
      ];
      var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      var i;
      for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
          break;
        }
      }
      return (
        (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol
      );
    },
    findInterval: function(value) {
      return this.intervals.findIndex(el => el.min <= value && el.max > value);
    },
    getElemIndex: function(area, date) {
      return this.kpiArray.findIndex(
        x => x.d === date.toISOString().slice(0, 10) && x.dep === area
      );
    },
    getElemValue: function(area, date) {
      return this.getElemIndex(area, date) > -1
        ? this.kpiArray[this.getElemIndex(area, date)].v
        : "";
    }
  }
};
</script>

<style>
/* Component Specific Style */
.hMap0 {
  background-color: var(--color-map-0);
  color: var(--color-map-text-0) !important;
}
.hMap1 {
  background-color: var(--color-map-1);
  color: var(--color-map-text-1) !important;
}
.hMap2 {
  background-color: var(--color-map-2);
  color: var(--color-map-text-2) !important;
}
.hMap3 {
  background-color: var(--color-map-3);
  color: var(--color-map-text-3) !important;
}
.hMap4 {
  background-color: var(--color-map-4);
  color: var(--color-map-text-4) !important;
}
.hMap5 {
  background-color: var(--color-map-5);
  color: var(--color-map-text-5) !important;
}
.hMap6 {
  background-color: var(--color-map-6);
  color: var(--color-map-text-6) !important;
}
.hMap {
  width: 50px;
  height: 20px;
  color: black;
  margin-right: 2px;
  text-align: center;
  flex: 1;
  font-weight: 500;
}
.hMapT {
  width: 100px;
  height: 30px;
  color: #9e9e9e;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.hMapL {
  width: 100px;
  height: 20px;
  color: black;
  margin-right: 2px;
  text-align: center;
  font-weight: 400;
}
.divArea {
  display: flex;
}
#divDpt0 {
  display: flex;
  margin-top: 10px;
}
#divDpt1 {
  display: flex;
}
#divDpt2 {
  display: flex;
}
#divDpt3 {
  display: flex;
}
#divHeatMapMonth {
  display: flex;
  font-weight: bold;
}
#divHeatMapDay {
  display: flex;
  font-weight: bold;
}
#divLegend {
  display: flex;
  margin-top: 10px;
  font-weight: bold;
}
</style>