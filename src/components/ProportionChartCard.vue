<template>
  <v-card min-height="100%" :loading="isLoading">
    <v-card-title
      style="word-break: break-word;"
    >Proportions Hommes/Femmes jusqu'au {{new Date(lastDate).toLocaleDateString('fr-FR', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}}</v-card-title>
    <v-card-subtitle>
      <div class="kpiTitle">{{selectedKPI}}</div>
      <div class="areaTitle">{{selectedArea}}</div>
    </v-card-subtitle>
    <v-card-text>
      <ProportionChart
        :womenReducedRecord="womenReducedRecord"
        :menReducedRecord="menReducedRecord"
        :selectedKPI="selectedKPI"
        :selectedArea="selectedArea"
        :colorWomen="colorWomen"
        :colorMen="colorMen"
      />
    </v-card-text>
  </v-card>
</template>


<script>
import ProportionChart from "./ProportionChart";

export default {
  name: "ProportionChartCard",
  components: { ProportionChart },
  props: {
    womenReducedRecord: { type: Array, default: () => [] },
    menReducedRecord: { type: Array, default: () => [] },
    selectedKPI: { type: String, default: "DEFAULT" },
    selectedArea: { type: String, default: "DEFAULT" },
    colorMen: { type: String, default: "#000" },
    colorWomen: { type: String, default: "#000" },
    lastDate: { type: String, default: "2020-04-01" },
    isLoading: {type: Boolean, default:false}
  },
  computed: {},
  watch: {},
  methods: {},
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
</style>