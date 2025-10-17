<template>
  <v-container class="h-100 text-justify">
    <dynamic-section :section="app.book.data.acknowledgements" />
    <continue-button to="/the-story-so-far" />
  </v-container>
</template>

<script setup lang="ts">
// Define constants
const app = useAppStore();
const route = useRoute();

// Setup navigation state
app.navigation.showAppbar = true;
app.navigation.showBottomNav = true;
app.navigation.title = app.book.data.acknowledgements.id;
app.addHistory(app.book.data.acknowledgements.id, route.path);

// Setup page head
useHead({
  title: "Kai-Master - Acknowledgements",
});
</script>
