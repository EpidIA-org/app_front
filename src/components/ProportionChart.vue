<template>
  <GChart
    min-height="100%"
    :settings="{packages: ['corechart']}"
    :data="chartData"
    :options="chartOptions"
    :createChart="(el, google) => new google.visualization.AreaChart(el)"
    @ready="onChartReady"
  />
</template>

<script>
import { GChart } from "vue-google-charts";
export default {
  name: "ProportionChart",
  components: { GChart },
  props: {
    womenReducedRecord: {
      type: Array,
      default: () => []
    },
    menReducedRecord: {
      type: Array,
      default: () => []
    },
    selectedKPI: {
      type: String,
      default: "DEFAULT"
    },
    selectedArea: {
      type: String,
      default: "DEFAULT"
    },
    colorWomen: {
      type: String,
      default: "#000"
    },
    colorMen: {
      type: String,
      default: "#000"
    }
  },

  data: () => ({
    chartsLib: null
  }),
  created: function() {},
  mounted: function() {},
  watch: {},

  computed: {
    dataArray: function() {
      let arrWomen = this.sortArray(this.womenReducedRecord);
      let arrMen = this.sortArray(this.menReducedRecord);
      let data = []
      for (let i =0; i < arrMen.length; i++){
          data.push([arrMen[i].date, arrMen[i].data, arrWomen[i].data])
      }
      return data
    },
    chartData: function() {
      let chartArray = [];
      chartArray.push(["Date", "Hommes", "Femmes"]);
      return chartArray.concat(this.dataArray);
    },
    chartOptions: function() {
      if (!this.chartsLib) return null;
      return {
        isStacked: "relative",
        chart: {
          title: this.selectedKPI,
          subtitle: this.selectedArea
        },
        bars: "vertical", // Required for Material Bar Charts.
        hAxis: { format: "decimal" },
        height: 280,
        vAxis: {format: "percent"},
        colors: [this.colorMen, this.colorWomen],
        legend: { position: "top" }
      };
    }
  },
  methods: {
    onChartReady(chart, google) {
      this.chartsLib = google;
    },
    sortArray: function(arr){
        return arr.sort(function(a, b) {
        if (a.date > b.date) {
          return 1;
        }
        if (b.date > a.date) {
          return -1;
        }
        return 0;
      })
    }
  }
};
</script>


<style>
</style>





