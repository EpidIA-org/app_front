<template>
  <v-navigation-drawer v-model="isOpen" absolute right temporary>
    <v-list nav dense>
      <h3>EpidIA Initiative</h3>
      <v-list-item-group active-class="deep-purple--text text--accent-4">
        <v-list-item v-for="section in sections" :key="section.text">
          <v-list-item-title :onclick="`window.location.href = '${section.link}';`">{{section.text}}</v-list-item-title>
        </v-list-item>
        <ContributorPanel/>
      </v-list-item-group>
      <!-- <v-divider></v-divider> -->
      <SourcesList/>
      
    </v-list>
  </v-navigation-drawer>
</template>


<script>
import SourcesList from "./SourcesList";
import ContributorPanel from "./ContributorPanel";


export default {
  name: "Drawer",
  components: {
      SourcesList,
      ContributorPanel
  },

  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    sections: [
      { text: "Accueil", link: "https://covid-ia.org/" },
      { text: "Blog", link: "https://covid-ia.org/blog/" },
      { text: "A propos", link: "https://covid-ia.org/about-us/" },
      {
        text: "Contact",
        link:
          "https://26fec6c8.sibforms.com/serve/MUIEAATIvALvkE7eBH0-TYp9kgf7PT-frNdC0GT2cg7Fl--wkU9KiV7GeIfEGEBt2_Rh1hTlge1RiiYkJT4BkyQUX2UUaaoeb4IXd6gw5rB9Pqb53sV7Z70Tv5d2OAgUkclFJBfw8S7oWMrMpFJ7fyjfk_Ym-SiNd4gd0nLLg2AKBj27N4G5UW7o3QTFyLgs_RO1XXaPQYgMUKJ3"
      }
    ],
    isOpen: false
  }),
  created: function() {},
  mounted: function() {},

  computed: {},
  watch: {
      value: function(){
          this.isOpen = this.value;
      },
    isOpen: function() {
      this.$emit("input", this.isOpen);
    //   this.$emit('change', this.isOpen);
    }
  },
  methods: {}
};
</script>


<style>
</style>





