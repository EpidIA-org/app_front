<template>
  <GChart
    min-height="100%"
    :settings="{packages: ['line']}"
    :data="chartData"
    :options="chartOptions"
    :createChart="(el, google) => new google.charts.Line(el)"
    @ready="onChartReady"
  />
</template>

<script>
import { GChart } from "vue-google-charts";
export default {
  name: "LineChart",
  components: { GChart },
  props: {
    reducedRecord: {
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
    color: {
      type: String,
      default: "#000"
    }
  },

  data: () => ({
    chartsLib: null
  }),
  created: function() {},
  mounted: function() {},
  watch: {
    reducedRecord: function() {}
  },

  computed: {
    sortedArray: function() {
      let arr = this.reducedRecord;
      return arr.sort(function(a, b) {
        if (a.date > b.date) {
          return 1;
        }
        if (b.date > a.date) {
          return -1;
        }
        return 0;
      });
    },
    growthArray: function() {
      let arr = [];
      for (let i = 1; i < this.sortedArray.length; i++) {
        arr.push({
          data: ((this.sortedArray[i].data - this.sortedArray[i - 1].data) / this.sortedArray[i].data),
          date: this.sortedArray[i].date
        });
      }
      return arr
    },
    chartData: function() {
      let chartArray = [];
      chartArray.push(["Date", ""]);
      let dataArray = this.growthArray.map(x => [x.date, x.data]);
      return chartArray.concat(dataArray);
    },
    chartOptions: function() {
      if (!this.chartsLib) return null;
      return this.chartsLib.charts.Line.convertOptions({
        // chart: {
        //   title: this.selectedKPI,
        //   subtitle: this.selectedArea
        // },
        curveType: "function",
        vAxis:{format: 'percent'},
        height: 230,
        colors: [this.color],
        legend: { position: "bottom" }
      });
    }
  },
  methods: {
    onChartReady(chart, google) {
      this.chartsLib = google;
    }
  }
};
</script>


<style>
</style>





