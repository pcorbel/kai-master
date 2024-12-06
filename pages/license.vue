<template>
  <v-container class="h-100 text-justify">
    <dynamic-section :section="app.book.data.license" />
  </v-container>
</template>

<script setup lang="ts">
// Define constants
const app = useAppStore();

// Setup navigation state
app.navigation.showAppbar = true;
app.navigation.showBottomNav = true;
app.navigation.title = app.book.data.license.id;

// Setup page head
useHead({
  title: "Kai-Master - Project Aon License",
});
</script>
