<template>
  <v-card class="mx-auto" max-width="400" outlined>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>Sources de données</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-container style="overflow:scroll;height:250px">
        <v-list>
      <v-list-item three-line v-for="source in sources" :key="source.name">
        <v-list-item-content>
          <v-list-item-title>{{source.name}}</v-list-item-title>
          <v-list-item-subtitle>
            Crédit:
            <a :href="source.link" target="_blank">{{source.author}}</a>
          </v-list-item-subtitle>
          <v-list-item-subtitle>{{source.desc}}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      </v-list>
    </v-container>
  </v-card>
</template>


<script>
export default {
  name: "NAME_HERE",
  components: {},

  data: () => ({
    sources: [
      {
        name: "Donnée Covid-19",
        author: "Santé publique France - data.gouv.fr",
        desc: "Données hospitalières relatives à l'épidémie de COVID-19",
        link:
          "https://www.data.gouv.fr/en/datasets/donnees-hospitalieres-relatives-a-lepidemie-de-covid-19/"
      },
      {
        name: "Carte",
        author: "Grégoire David - INSEE - IGN",
        desc: "Tracés des départements français au format GeoJSON",
        link: "https://france-geojson.gregoiredavid.fr/"
      },
      {
        name: "Lits en réanimations en 2018",
        author: "Ministère des solidarités et de la santé",
        desc: "Capacités hospitalières par département en lits en 2018",
        link:
          "https://drees.solidarites-sante.gouv.fr/etudes-et-statistiques/publications/article/nombre-de-lits-de-reanimation-de-soins-intensifs-et-de-soins-continus-en-france"
      },
      {
        name: "Décès quotidiens par département",
        author: "INSEE",
        desc: "Comparaison par année des décès, toutes causes comprises",
        link: "https://www.insee.fr/fr/information/4470857"
      }
    ]
  }),
  created: function() {},
  mounted: function() {},

  computed: {},
  watch: {},
  methods: {}
};
</script>


<style>
</style>





