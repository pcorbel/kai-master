<template>
  <v-container class="h-100 text-justify">
    <dynamic-section :section="app.book.data.kaiWisdom" />
    <continue-button to="/section-1" />
  </v-container>
</template>

<script setup lang="ts">
// Define constants
const app = useAppStore();
const route = useRoute();

// Setup navigation state
app.navigation.showAppbar = true;
app.navigation.showBottomNav = true;
app.navigation.title = app.book.data.kaiWisdom.id;
app.addHistory(app.book.data.kaiWisdom.id, route.path);

// Setup page head
useHead({
  title: "Kai-Master - Kai Wisdom",
});
</script>
