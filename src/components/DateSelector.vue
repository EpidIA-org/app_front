<template>
  <v-card>
    <v-card-text>
      <v-menu 
      z-index="7000"
        ref="menu1"
        v-model="menu1"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="dateFormatted"
            label="Date"
            prepend-icon="mdi-calendar"
            @blur="date = parseDate(dateFormatted)"
            v-on="on"
            :hide-details="true"
          ></v-text-field>
        </template>
        <v-date-picker  style="z-index:8000;"
          v-model="date"
          no-title
          @input="menu1 = false"
          :allowed-dates="checkValidDate"
        ></v-date-picker>
      </v-menu>
    </v-card-text>
  </v-card>
</template>


<script>
export default {
  name: "DateSelector",
  components: {},

  props: {
    value: {
      type: String,
      default: new Date().toISOString().substr(0, 10)
    },
    maxDateAllowed: {
        type: String,
        default: null
    }
  },

  data: vm => ({
    date: vm.value,
    dateFormatted: vm.formatDate(vm.value),
    menu1: false,
    menu2: false
  }),

  computed: {
    computedDateFormatted: function() {
      return this.formatDate(this.date);
    }
  },

  watch: {
    date: function() {
      this.dateFormatted = this.formatDate(this.date);
      let dateToEmit = this.formatDate(this.date);
      this.$emit("input", dateToEmit);
    }
  },

  methods: {
    formatDate: function(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${year}-${month}-${day}`;
    },
    parseDate: function(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    checkValidDate: function(date) {
      let minDate = "2020-03-18";
      let maxDate = new Date().toISOString().substr(0, 10);
      let upperBoundCondition = (this.maxDateAllowed === null)? (date < maxDate): (date <= this.maxDateAllowed)
      return date >= minDate && upperBoundCondition;
    }
  }
};
</script>


<style scoped>
.v-card__text {
    padding:2px 25px 6px 25px;
}
</style>