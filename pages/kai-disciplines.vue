<template>
  <v-container class="h-100 text-justify">
    <dynamic-section :section="app.book.data.kaiDisciplines" />
    <continue-button to="/equipment" />
  </v-container>
</template>

<script setup lang="ts">
// Define constants
const app = useAppStore();
const route = useRoute();

// Setup navigation state
app.navigation.showAppbar = true;
app.navigation.showBottomNav = true;
app.navigation.title = app.book.data.kaiDisciplines.id;
app.addHistory(app.book.data.kaiDisciplines.id, route.path);

// Setup page head
useHead({
  title: "Kai-Master - Kai Disciplines",
});
</script>
