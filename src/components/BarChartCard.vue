<template>
  <v-card min-height="100%" :loading="isLoading">
    <v-card-title class="d-flex align-start" style="word-break: break-word;">
      Evolution jusqu'au {{new Date(lastDate).toLocaleDateString('fr-FR', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}}
      <v-spacer></v-spacer>
      <v-switch
        class="v-input--reverse v-input--expand mt-0 pt-0"
        absolute
        inset
        :color="color"
        v-model="switchValue"
        value
        :label="switchLabel"
      ></v-switch>
    </v-card-title>
    <v-card-subtitle>
      <div class="kpiTitle">{{selectedKPI}} - {{switchLabel}}</div>
      <div class="areaTitle">{{selectedArea}}</div>
    </v-card-subtitle>
    <v-card-text>
      <BarChart v-if="!switchValue"
        :reducedRecord="reducedRecord"
        :selectedKPI="selectedKPI"
        :selectedArea="selectedArea"
        :color="color"
      />
      <LineChart v-else
        :reducedRecord="reducedRecord"
        :selectedKPI="selectedKPI"
        :selectedArea="selectedArea"
        :color="color"
      />
      <!-- <v-tabs vertical>
        <v-tab>
          <v-icon left>mdi-chart-bar</v-icon>
        </v-tab>
        <v-tab>
          <v-icon left>mdi-chart-line</v-icon>
        </v-tab>

        <v-tab-item>
          <BarChart
            :reducedRecord="reducedRecord"
            :selectedKPI="selectedKPI"
            :selectedArea="selectedArea"
            :color="color"
          />
        </v-tab-item>
        <v-tab-item>
          <BarChart
            :reducedRecord="reducedRecord"
            :selectedKPI="selectedKPI"
            :selectedArea="selectedArea"
            :color="color"
          />
        </v-tab-item>
      </v-tabs>-->
    </v-card-text>
  </v-card>
</template>


<script>
import BarChart from "./BarChart";
import LineChart from "./LineChart";

export default {
  name: "BarChartCard",
  components: { BarChart, LineChart },
  props: {
    reducedRecord: { type: Array, default: () => [] },
    selectedKPI: { type: String, default: "DEFAULT" },
    selectedArea: { type: String, default: "DEFAULT" },
    color: { type: String, default: "#000" },
    lastDate: { type: String, default: "2020-04-01" },
    isLoading: {type: Boolean, default:false}
  },
  data: () => ({
    switchValue: false
  }),
  computed: {
    switchLabel: function() {
      return this.switchValue ? "Croissance" : "Valeur";
    }
  },
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
/* // Reversed input variant */
.v-input--reverse .v-input__slot {
  flex-direction: row-reverse;
  justify-content: flex-end;
}
.v-input--reverse .v-input__control .v-input__slot{
      margin-right: 0;
      margin-left: 8px;
}

/* // Bonus "expand" variant */
.v-input--expand .v-input__slot .v-label {
  display: block;
  flex: 1;
}
</style>