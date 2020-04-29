<template>
  <v-card
    :class="'mx-auto card-kpi kpi-'+color"
    :min-width="minWidth"
    min-height="100%"
    :loading="isLoading"
  >
    <v-card-text class="card-kpi-text">
      <h3 class="text-right">
        <span :class="`${color}--text font-weight-regular`">{{title}}</span>
        <v-tooltip v-if="hoverMsg !== null" bottom>
          <template v-slot:activator="{on}">
            <v-icon :color="`${color} darken-2`" v-on="on">mdi-information-outline</v-icon>
          </template>
          {{hoverMsg}}
        </v-tooltip>
      </h3>
      <span class="d-flex align-center justify-space-around">
        <span class>
          <h2 :class="`text-center title ${color}--text d-flex justify-space-around`">
            <span class>
              <span class="grey--text font-weight-regular">Total</span>
              &nbsp;{{totalFigure}}
            </span>
            <span v-if="currentFigure > 0" class>
              <span class="grey--text font-weight-light">Actuel</span>
              &nbsp;{{currentFigure}}
            </span>
          </h2>
          <h4 class="text-right font-weight-light">
            Nouveaux cas
            <span :class="`${color}--text font-weight-bold`">{{newFigure}}</span>
          </h4>
          <h4 class="text-right font-weight-light">
            +
            <span :class="`${color}--text font-weight-bold`">{{this.formatFloat(evolutionFigure)}}%</span> depuis hier
          </h4>
        </span>
      </span>
    </v-card-text>
  </v-card>
</template>


<script>
export default {
  name: "KPICard",
  components: {},

  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    data: {
        type: Object,
        default: () => {}
    },
    color: {
      type: String,
      default: "blue"
    },
    title: {
      type: String,
      default: "Cas"
    },
    minWidth: {
      type: String,
      default: "10%"
    },
    hoverMsg: {
      type: String,
      default: null
    }
  },

  data: () => ({}),

  computed: {
    keyName() {
      return this.$vnode.key;
    },
    newFigure() {
        return (this.keyName in this.data.new)? this.data.new[this.keyName] : '--'
    },
    totalFigure() {
        return (this.keyName in this.data.total)? this.data.total[this.keyName] : '--'
    },
    currentFigure() {
        return (this.keyName in this.data.current)? this.data.current[this.keyName] : -1
    },
    evolutionFigure() {
      return 100 * (this.newFigure / (this.totalFigure - this.newFigure));
    }
  },

  watch: {},

  methods: {
    formatFloat: function() {
      return this.evolutionFigure.toFixed(1);
    }
  }
};
</script>


<style>
.kpi-red {
  background: linear-gradient(
    90deg,
    #fe4a48 0%,
    #fe4a48 5%,
    white 5%,
    white 100%
  );
}
.kpi-green {
  background: linear-gradient(
    90deg,
    #b5cea8 0%,
    #b5cea8 5%,
    white 5%,
    white 100%
  );
}
.kpi-blue {
  background: linear-gradient(
    90deg,
    #5792ec 0%,
    #5792ec 5%,
    white 5%,
    white 100%
  );
}

.card-kpi-text {
  padding: 5px;
  padding-right: 10%;
}
</style>