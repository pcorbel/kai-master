<template>
  <v-container class="h-100 text-justify">
    <dynamic-section :section="app.book.data.kaiLevels" />
    <continue-button :to="getNext()" />
  </v-container>
</template>

<script setup lang="ts">
// Define constants
const app = useAppStore();
const route = useRoute();

// Setup navigation state
app.navigation.showAppbar = true;
app.navigation.showBottomNav = true;
app.navigation.title = app.book.data.kaiLevels.id;
app.addHistory(app.book.data.kaiLevels.id, route.path);

// Setup page head
useHead({
  title: "Kai-Master - Levels of Kai Training",
});

// Define functions
const getNext = () => {
  switch (app.book.serie) {
    case "Kai":
      return "/kai-wisdom";
    case "Magnakai":
      return "/lore-circles";
    case "Grand Master":
      return "/improved-disciplines";
  }
};
</script>
