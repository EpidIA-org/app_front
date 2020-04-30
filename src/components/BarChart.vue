<template>
  <GChart
    min-height="100%"
    :settings="{packages: ['bar']}"
    :data="chartData"
    :options="chartOptions"
    :createChart="(el, google) => new google.charts.Bar(el)"
    @ready="onChartReady"
  />
</template>

<script>
import { GChart } from "vue-google-charts";
import { aggregate } from "../utils";
export default {
  name: "BarChart",
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
    hotfixArray: function() {
      if (this.$store.state.selectedAreaCode !== "00") {
        return this.$store.getters.areaPredictionRecords;
      } else {
        return aggregate(this.$store.getters.areaPredictionRecords, ["jour"], {
          key: this.hotfixHasPredictions,
          fn: (total, value) => total + value
        });
      }
    },
    hotfixHasPredictions: function() {
      if (
        this.$store.state.selectedKPI === "Personnes hospitalisées (nouveaux)"
      ) {
        return "new_hosp";
      } else if (
        this.$store.state.selectedKPI === "Personnes décédées (nouveaux)"
      ) {
        return "new_death";
      } else {
        return false;
      }
    },
    labels: function() {
      return this.sortedArray.map(x => x.date);
    },
    values: function() {
      return this.sortedArray.map(x => x.data);
    },
    chartData: function() {
      let chartArray = [];
      let dataArray = [];
      if (this.hotfixHasPredictions) {
        chartArray.push(["Date", "", "Pred"]);
        dataArray = this.sortedArray.map(x => [x.date, x.data, 0]);
        console.log(this.hotfixArray);
        dataArray = dataArray.concat(
          this.hotfixArray.map(x => [x.jour, 0, x[this.hotfixHasPredictions]])
        );
      } else {
        chartArray.push(["Date", ""]);
        dataArray = this.sortedArray.map(x => [x.date, x.data]);
      }
      return chartArray.concat(dataArray);
    },
    chartOptions: function() {
      if (!this.chartsLib) return null;
      return this.chartsLib.charts.Bar.convertOptions({
        // chart: {
        //   title: this.selectedKPI,
        //   subtitle: this.selectedArea
        // },
        bars: "vertical", // Required for Material Bar Charts.
        hAxis: { format: "decimal" },
        height: 230,
        wAxis: { format: "decimal" },
        colors: this.hotfixHasPredictions
          ? [this.color, "black"]
          : [this.color],
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





