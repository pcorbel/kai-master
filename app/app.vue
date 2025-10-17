<template>
  <!-- The App -->
  <v-app>
    <nuxt-pwa-manifest />
    <the-app-bar v-if="app.navigation.showAppbar" />
    <v-main>
      <nuxt-page />
    </v-main>
    <the-bottom-nav v-if="app.navigation.showBottomNav" />
    <loading-overlay />
  </v-app>
</template>

<script setup lang="ts">
// Define constants
const app = useAppStore();
</script>
