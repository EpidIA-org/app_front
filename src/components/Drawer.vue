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
      { text: "Accueil", link: "https://epidia.org/" },
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





