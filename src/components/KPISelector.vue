<template>
  <v-card>
    <v-card-text>
      <v-select
        prepend-icon="mdi-thermostat"
        :items="displayChoices"
        label="Quelle informations afficher?"
        :value="value"
        @change="changeValue"
        :hide-details="true"
      ></v-select>
    </v-card-text>
  </v-card>
</template>


<script>
export default {
  name: "KPISelector",
  components: {},

  props: {
    value: {
      type: String,
      default: "None"
    },
    choices: {
      type: Object,
      default: () => {}
    }
  },

  data: () => ({}),

  computed: {
    displayChoices: function() {
      return Object.keys(this.choices);
    }
  },

  watch: {},

  methods: {
    changeValue: function(value) {
      this.$emit("input", value);
    }
  }
};
</script>


<style scoped>
.v-card__text {
    padding:2px 25px 6px 25px;
}
</style>