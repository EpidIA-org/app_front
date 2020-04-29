<template>
  <v-row>
    <v-col cols="9">
      <v-progress-linear :value="value" :color="color" ></v-progress-linear>
    </v-col>
    <v-col cols="3">{{value}}%</v-col>
  </v-row>
</template>


<script>

export default {
  name: "SaturationChart",
  components: { },
  props: {
    value: {
      type: Number,
      default: 2
    },
    colorScale: {
      type: Array,
      default: () => [null, "teal", "amber", "pink", "red darken-2"]
    },
    colorLimits: {
      type: Array,
      default: () => [0, 25, 75, 100]
    }
  },
  computed: {
    color:function(){
        let idx = this.colorLimits.findIndex(x => x>this.value);
        return (idx>-1)?this.colorScale[idx]:this.colorScale[this.colorScale.length-1]
    }
  },
  watch: {
  },
  methods: {},
  mounted() {}
};
</script>