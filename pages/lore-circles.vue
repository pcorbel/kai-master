<template>
  <v-container class="h-100 text-justify">
    <dynamic-section :section="app.book.data.loreCircles" />
    <continue-button to="/improved-disciplines" />
  </v-container>
</template>

<script setup lang="ts">
// Define constants
const app = useAppStore();
const route = useRoute();

// Setup navigation state
app.navigation.showAppbar = true;
app.navigation.showBottomNav = true;
app.navigation.title = app.book.data.loreCircles.id;
app.addHistory(app.book.data.loreCircles.id, route.path);

// Setup page head
useHead({
  title: "Kai-Master - Lore Circles",
});
</script>
