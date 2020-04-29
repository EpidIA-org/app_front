<template>
  <GChart min-height="100%"
    :settings="{packages: ['bar']}"
    :data="chartData"
    :options="chartOptions"
    :createChart="(el, google) => new google.charts.Bar(el)"
    @ready="onChartReady"
  />
</template>

<script>
import { GChart } from "vue-google-charts";
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
        type:String,
        default: "#000"
    }
  },

  data: () => ({
      chartsLib: null, 
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
    labels: function() {
      return this.sortedArray.map(x => x.date);
    },
    values: function() {
      return this.sortedArray.map(x => x.data);
    },
    chartData: function(){
        let chartArray = []
        chartArray.push(['Date', ''])
        let dataArray  = this.sortedArray.map(x => [x.date, x.data])
        return chartArray.concat(dataArray)
    },
    chartOptions: function() {
      if (!this.chartsLib) return null
      return this.chartsLib.charts.Bar.convertOptions({
        // chart: {
        //   title: this.selectedKPI,
        //   subtitle: this.selectedArea
        // },
        bars: 'vertical', // Required for Material Bar Charts.
        hAxis: { format: 'decimal' },
        height: 230,
        wAxis: { format: 'decimal' },
        colors: [this.color],
        legend: { position: 'bottom' }
      })
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





