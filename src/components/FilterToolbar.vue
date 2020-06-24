<template>
  <v-app-bar class="toolbar" v-show="showNavbar" bottom fixed :collapse="showNavbar">
    <v-toolbar-title>
      <img class="mr-3" :src="require('../assets/epidia.jpg')" height="50" />
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
    <v-menu ref="dialog" v-model="modal" :return-value.sync="selectedDate" persistent width="290px">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon color="primary">mdi-calendar</v-icon>
        </v-btn>
      </template>
      <v-date-picker
        style="z-index:8000;"
        v-model="selectedDate"
        no-title
        @input="modal = false"
        :allowed-dates="checkValidDate"
      ></v-date-picker>
    </v-menu>
    <v-menu absolute offset-y>
      <template v-slot:activator="{ on: menu }">
        <v-tooltip top>
          <template v-slot:activator="{ on: tooltip }">
            <v-btn icon color="primary" dark v-on="{ ...tooltip, ...menu }">
              <v-icon>mdi-thermostat</v-icon>
            </v-btn>
          </template>
          <span>Donnée à afficher</span>
        </v-tooltip>
      </template>
      <v-list shaped>
        <v-list-item-group v-model="itemKPI" color="primary">
          <v-list-item v-for="(itemKPI, index) in itemsKPIS" :key="index">
            <v-list-item-title>{{ itemKPI }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>


<script>
export default {
  name: "FilterToolbar",
  components: {},

  props: {},

  data: () => ({
    date: null,
    modal: false,
    itemKPI: 0,
    showNavbar: false,
    lastScrollPosition: 0
  }),
  created: function() {},
  mounted: function() {
    this.date = this.parseDate(this.selectedDate);
    window.addEventListener("scroll", this.onScroll);
  },
  beforeDestroy: function() {
    window.removeEventListener("scroll", this.onScroll);
  },

  computed: {
    itemsKPIS: function() {
      return Object.keys(this.$store.state.availableKPIs);
    },
    selectedDate: {
      get() {
        return this.$store.state.selectedDate;
      },
      set(value) {
        this.$emit("setDate", this.formatDate(value));
      }
    },
    lastUpdated: function() {
      return this.$store.state.lastDataUpdateDate;
    }
  },
  watch: {
    itemKPI: function(kpi) {
      this.$store.commit("setKPI", this.itemsKPIS[kpi]);
    }
  },
  methods: {
    onScroll() {
      const currentScrollPosition =
        window.pageYOffset || document.documentElement.scrollTop;
      if (currentScrollPosition < 0) {
        return;
      }
      // Stop executing this function if the difference between
      // current scroll position and last scroll position is less than some offset
      if (Math.abs(currentScrollPosition - this.lastScrollPosition) < 60) {
        return;
      }
      this.showNavbar = currentScrollPosition > 300; //this.lastScrollPosition;
      this.lastScrollPosition = currentScrollPosition;
    },
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
      return date >= minDate && date <= this.lastUpdated;
    },
    checkDate: function(date) {
      console.log(date);
    }
  }
};
</script>


<style>
.toolbar {
  height: 60px;
  width: 100vw;
  background: hsl(200, 50%, 50%);
  position: fixed;
  box-shadow: 0 2px 15px rgba(71, 120, 120, 0.5);
  transform: translate3d(0, 0, 0);
  transition: 0.1s all ease-out;
}
.toolbar.toolbar--hidden {
  box-shadow: none;
  transform: translate3d(0, -100%, 0);
}
</style>





