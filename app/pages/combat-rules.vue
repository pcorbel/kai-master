<template>
  <v-container class="h-100 text-justify">
    <dynamic-section :section="app.book.data.combatRules" />
    <continue-button to="/levels-of-kai-training" />
  </v-container>
</template>

<script setup lang="ts">
// Define constants
const app = useAppStore();
const route = useRoute();

// Setup navigation state
app.navigation.showAppbar = true;
app.navigation.showBottomNav = true;
app.navigation.title = app.book.data.combatRules.id;
app.addHistory(app.book.data.combatRules.id, route.path);

// Setup page head
useHead({
  title: "Kai-Master - Combat Rules",
});
</script>
