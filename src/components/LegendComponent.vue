<template>
  <div style="display:flex;flex-direction:column;">
    <div class="legend" v-for="(color, i) in colorScale" :key="color">
      <i class :style="`background:${color};color:${color}`">-</i>
      <span>{{scaleInterval[i].min}}{{(scaleInterval[i+1]) ? `-${scaleInterval[i+1].min}`: '+'}}</span>
    </div>
  </div>
</template>


<script>
export default {
  name: "LegendComponent",
  components: {},
  props:{
      scaleInterval: Array,
      colorScale:Array,
  },
  data: () => ({}),
  created: function() {},
  mounted: function() {},

  computed: {},
  watch: {},
  methods: {}
};
</script>


<style>
.legend {
    line-height: 15px;
    color: #555;
}
.legend i {
    width: 15px;
    height: 15px;
    float: left;
    margin-right: 8px;
    opacity: 0.7;
}
</style>





