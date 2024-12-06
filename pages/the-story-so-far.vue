<template>
  <v-container class="h-100 text-justify">
    <dynamic-section :section="app.book.data.theStorySoFar" />
    <continue-button to="/the-game-rules" />
  </v-container>
</template>

<script setup lang="ts">
// Define constants
const app = useAppStore();
const route = useRoute();

// Setup navigation state
app.navigation.showAppbar = true;
app.navigation.showBottomNav = true;
app.navigation.title = app.book.data.theStorySoFar.id;
app.addHistory(app.book.data.theStorySoFar.id, route.path);

// Setup page head
useHead({
  title: `Kai-Master - The Story So Far …`,
});
</script>
