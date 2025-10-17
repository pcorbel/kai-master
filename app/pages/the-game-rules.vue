<template>
  <v-container class="h-100 text-justify">
    <dynamic-section :section="app.book.data.theGameRules" />
    <continue-button to="/kai-disciplines" />
  </v-container>
</template>

<script setup lang="ts">
// Define constants
const app = useAppStore();
const route = useRoute();

// Setup navigation state
app.navigation.showAppbar = true;
app.navigation.showBottomNav = true;
app.navigation.title = app.book.data.theGameRules.id;
app.addHistory(app.book.data.theGameRules.id, route.path);

// Setup page head
useHead({
  title: `Kai-Master - The Game Rules`,
});
</script>
