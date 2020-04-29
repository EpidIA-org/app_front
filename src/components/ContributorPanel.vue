<template>
  <v-row class="ml-0 mr-0">
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{ on }">
        <v-list-item key="contributors">
          <v-list-item-title v-on="on" @click="dialog = true">Contributeurs</v-list-item-title>
        </v-list-item>
      </template>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Nos Contributeurs</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="dialog = false" disabled>
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list dense two-line avatar rounded>
          <v-row>
            <v-col v-for="(colItem, index) in itemsNested" :key="index" cols="12" sm="6" md="4" lg="3">
              <v-list-item-group color="primary">
                <v-list-item v-for="(item, i) in colItem" :key="i" :href="item.link" target="_blank">
                  <v-list-item-avatar color="indigo">
                    <v-img v-if="item.avatar" :src="item.avatar"></v-img>
                    <span v-else class="white--text headline">{{item.title.split(' ')[0][0]}}{{item.title.split(' ')[1][0]}}</span>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-html="item.title"></v-list-item-title>
                    <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-col>
          </v-row>
        </v-list>
      </v-card>
    </v-dialog>
  </v-row>
</template>


<script>
export default {
  name: "ContributorPanel",
  components: {},

  data: () => ({
    dialog: false,
    notifications: false,
    sound: false,
    widgets: false,
    numPerColumn: 6, 
  }),
  created: function() {},
  mounted: function() {},

  computed: {
      items: function(){
          return this.$store.state.contributors
      },
      reminderItem: function(){
          return this.items.length % this.numPerColumn
      },
      numColumn: function(){
          return (this.items.length - this.reminderItem) / this.numPerColumn
      },
      itemsNested: function(){
          let nestedItems = [];
          let iter = (this.reminderItem > 0)? this.numColumn+1 : this.numColumn
          for (let i=0; i < iter; i++){
              nestedItems.push(this.items.slice(i*this.numPerColumn, (i+1)*this.numPerColumn))
          }
          return nestedItems
      }
  },
  watch: {},
  methods: {}
};
</script>


<style>
</style>





