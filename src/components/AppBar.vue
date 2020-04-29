<template>
  <v-app-bar>
    <v-toolbar-title>
      <img class="mr-3" :src="require('../assets/covidia.jpg')" height="50" />
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <!-- On click emit a toggleDrawer event to open the Right panel -->
    <v-app-bar-nav-icon @click.stop="$emit('toggleDrawer')"></v-app-bar-nav-icon>

    <v-toolbar-items v-if="false" class="hidden-sm-and-down">
      <v-btn onclick="window.location.href = '#';" @click.stop="$emit('toggleDrawer')" text>Home</v-btn>
      <v-divider inset vertical></v-divider>
      <v-btn onclick="window.location.href = '#';" text>Blog</v-btn>
      <v-divider inset vertical></v-divider>
      <v-btn onclick="window.location.href = '#';" text>Contact</v-btn>
      <v-divider inset vertical></v-divider>
      <v-btn onclick="window.location.href = '#';" text>About</v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>


<script>
export default {
  name: "AppBar",
  components: {},

  props: {},

  data: () => ({
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





