<template>
  <GaugeChart ref="gauge" :chartData="chartData"/>
</template>

<script>
import GaugeChart from "./GaugeChart";

export default {
  name: "SaturationChart",
  components: { GaugeChart },
  props: {
    value: {
      type: Number,
      default: 2
    },
    colorScale:{
        type: Array,
        default: () => (["#0fdc63", "#fd9704", "#ff7143"])
    },
    colorLimits:{
        type: Array,
        default: () => ([0, 25, 75, 100])
    }
  },
  computed: {
    chartData: (vm) => ({
      datasets: [
        {
          backgroundColor: vm.colorScale,
          borderWidth: 0,
          gaugeData: {
            value: vm.value, 
            valueColor: "#ff7143"
          },
          gaugeLimits: vm.colorLimits
        }
      ]
    })
  },
  watch:{
      value: () => (this.$refs.gauge.genChart())
  },
  methods: {},
  mounted() {}
};
</script>