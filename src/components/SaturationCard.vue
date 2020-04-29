<template>
  <v-card>
    <v-card-title>
      Saturation hospitalière le {{new Date(selectedDate).toLocaleDateString('fr-FR', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}}
      <v-tooltip v-if="true" bottom>
        <template v-slot:activator="{on}">
          <v-icon color="pink darken-2" v-on="on">mdi-information-outline</v-icon>
        </template>
        Cet indice est calculé sur la base des données du nombre de lit fournit par [SOURCE] en 2018
      </v-tooltip>
    </v-card-title>
    <v-card-text>
      Saturation en réanimation
      <SaturationBar :value="Math.round(100*status.data.current.critical / maximum.lits_reanimation)" />
    </v-card-text>
  </v-card>
</template>


<script>
import SaturationBar from "./SaturationBar";

export default {
  name: "SaturationCard",
  components: { SaturationBar },
  props: {
    status: {
      type: Object,
      default: () => ({})
    },
    maximum: {
      type: Object,
      default: () => ({})
    },
    selectedDate: {
        type: String, 
        default: "",
    }
  },
  computed: {},
  watch: {},
  methods: {},
  mounted() {}
};
</script>