<template>
  <v-card min-height="100%" :loading="isLoading">
    <v-card-title class="d-flex align-start" style="word-break: break-word;">
      Compraison des décès par an en {{selectedArea}}<v-tooltip v-if="true" bottom>
        <template v-slot:activator="{on}">
          <v-icon color="#FED766" v-on="on">mdi-information-outline</v-icon>
        </template>
        Cette statistique compare les décès totaux, inclu chiffre hors Covid-19
      </v-tooltip>
      <v-spacer></v-spacer>
      <v-switch
        class="v-input--reverse v-input--expand mt-0 pt-0"
        absolute
        inset
        color="#FED766"
        v-model="switchValue"
        value
        :label="switchLabel"
      ></v-switch>
    </v-card-title>
    <v-card-subtitle>
      <div>du {{new Date(labels[0]).toLocaleDateString('fr-FR', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}} au {{new Date(labels[labels.length-1]).toLocaleDateString('fr-FR', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}}</div>
      <div class="kpiTitle">{{switchLabel}}</div>
      <div class="areaTitle">{{selectedArea}}</div>
    </v-card-subtitle>
    <v-card-text>
      <GChart
        v-if="render"
        ref="chart"
        min-height="100%"
        :settings="{packages: ['bar', 'line']}"
        :data="chartData"
        :options="chartOptions"
        :createChart="(el, google) => (switchValue)?new google.charts.Line(el):new google.charts.Bar(el)"
        @ready="onChartReady"
      />
    </v-card-text>
  </v-card>
</template>


<script>
import { GChart } from "vue-google-charts";
export default {
  name: "InseeCard",
  components: { GChart },
  props: {
    selectedArea: { type: String, default: "DEFAULT" },
    isLoading: { type: Boolean, default: false }
  },
  data: () => ({
    data: () => [],
    switchValue: true,
    colors: [ "#F4511E","#4A148C","#FED766"],
    year: 2020,
    barChartsLib: null,
    lineChartsLib: null,
    chartsLib: null,
    render: true
  }),
  computed: {
    switchLabel: function() {
      return this.switchValue ? "Cumul" : "Journée";
    },
    inseeRecord: function() {
      return this.$store.getters.inseeAreaRecord.data;
    },
    arrayYm2: function() {
      return this.inseeRecord["year_" + (this.year - 2)];
    },
    arrayYm1: function() {
      return this.inseeRecord["year_" + (this.year - 1)];
    },
    arrayY: function() {
      return this.inseeRecord["year_" + this.year];
    },
    cumulArrayY: function() {
      return this.cumulativeArray(this.arrayY);
    },
    cumulArrayYm1: function() {
      return this.cumulativeArray(this.arrayYm1);
    },
    cumulArrayYm2: function() {
      return this.cumulativeArray(this.arrayYm2);
    },
    labels: function() {
      return this.inseeRecord.labels;
    },
    lastDate: function() {
      return this.labels[this.labels.length - 1];
    },
    dailyBarData: function() {
      let data = [
        [
          "Date",
          (this.year - 2).toString(),
          (this.year - 1).toString(),
          this.year.toString(),
          
        ]
      ];
      for (let i = 0; i < this.labels.length; i++) {
        data.push([
          this.labels[i],
          this.arrayYm2[i],
          this.arrayYm1[i],
          this.arrayY[i]
        ]);
      }
      return data;
    },
    cumulLineData: function() {
      let data = [
        [
          "Date",
          (this.year - 2).toString(),
          (this.year - 1).toString(),
          this.year.toString(),
          
        ]
      ];
      for (let i = 0; i < this.labels.length; i++) {
        data.push([
          this.labels[i],
          this.cumulArrayYm2[i],
          this.cumulArrayYm1[i],
          this.cumulArrayY[i]
        ]);
      }
      return data;
    },
    dailyChartOptions: function() {
      if (!this.barChartsLib) return null;
      return this.barChartsLib.charts.Bar.convertOptions({
        // chart: {
        //   title: this.selectedKPI,
        //   subtitle: this.selectedArea
        // },
        bars: "vertical", // Required for Material Bar Charts.
        hAxis: { format: "decimal" },
        height: 230,
        wAxis: { format: "decimal" },
        colors: this.colors,
        legend: { position: "bottom" }
      });
    },
    cumulChartOptions: function() {
      if (!this.lineChartsLib) return null;
      return this.lineChartsLib.charts.Line.convertOptions({
        // chart: {
        //   title: this.selectedKPI,
        //   subtitle: this.selectedArea
        // },
        bars: "vertical", // Required for Material Bar Charts.
        hAxis: { format: "decimal" },
        height: 230,
        wAxis: { format: "decimal" },
        colors: this.colors,
        legend: { position: "bottom" }
      });
    },
    chartOptions: function() {
      if (!this.chartsLib) return null;
      if (this.switchValue) {
        return this.chartsLib.charts.Line.convertOptions({
          // chart: {
          //   title: this.selectedKPI,
          //   subtitle: this.selectedArea
          // },
          bars: "vertical", // Required for Material Bar Charts.
          hAxis: { format: "decimal" },
          height: 230,
          wAxis: { format: "decimal" },
          colors: this.colors,
          legend: { position: "bottom" }
        });
      } else {
        return this.chartsLib.charts.Bar.convertOptions({
          // chart: {
          //   title: this.selectedKPI,
          //   subtitle: this.selectedArea
          // },
          bars: "vertical", // Required for Material Bar Charts.
          hAxis: { format: "decimal" },
          height: 230,
          wAxis: { format: "decimal" },
          colors: this.colors,
          legend: { position: "bottom" }
        });
      }
    },
    chartData: function() {
      return this.switchValue ? this.cumulLineData : this.dailyBarData;
    }
  },
  watch: {
    switchValue: function() {
      this.render = false;
      this.$nextTick(() => {
        // Add the component back in
        this.render = true;
      });
    }
  },
  methods: {
    cumulativeArray: function(array) {
      const cumulativeSum = (sum => value => (sum += value))(0);
      return array.map(cumulativeSum);
    },
    onBarChartReady(chart, google) {
      this.barChartsLib = google;
    },
    onLineChartReady(chart, google) {
      this.lineChartsLib = google;
    },
    onChartReady(chart, google) {
      this.chartsLib = google;
    }
  },
  mounted() {}
};
</script>

<style>
.kpiTitle {
  cursor: default;
  user-select: none;
  -webkit-font-smoothing: antialiased;
  font-family: Roboto;
  font-size: 16px;
  color: rgb(117, 117, 117);
}
.areaTitle {
  cursor: default;
  user-select: none;
  -webkit-font-smoothing: antialiased;
  font-family: Roboto;
  font-size: 14px;
  color: rgb(189, 189, 189);
}
/* // Reversed input variant */
.v-input--reverse .v-input__slot {
  flex-direction: row-reverse;
  justify-content: flex-end;
}
.v-input--reverse .v-input__control .v-input__slot {
  margin-right: 0;
  margin-left: 8px;
}

/* // Bonus "expand" variant */
.v-input--expand .v-input__slot .v-label {
  display: block;
  flex: 1;
}
</style>