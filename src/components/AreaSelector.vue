<template>
  <v-card>
    <v-card-text style="padding:3px">
      <v-autocomplete
        hint="Selectionner un département"
        :items="areas"
        label="Département"
        persistent-hint
        prepend-icon="mdi-map-search"
        :value="value"
        @change="changeValue"
        z-index="7000"
      ></v-autocomplete>
    </v-card-text>
  </v-card>
</template>


<script>
export default {
  name: "AreaSelector",
  components: {},

  props: {
      areas: {
          type: Array,
          default: () => []
      },
      value: {
        type: String,
        default: "00 - France"
      }
  },

  data: () => ({
  }),

  computed: {},

  watch: {},

  methods: {
      changeValue: function(value){
        this.$emit('input', value)          
      },
      
  }
};
</script>


<style >

</style>