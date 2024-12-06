<template>
  <v-container class="h-100 text-justify">
    <dynamic-section :section="section" />
  </v-container>
</template>

<script setup lang="ts">
// Define constants
const app = useAppStore();
const route = useRoute();
const id = `Section ${parseInt(route.params.id as string)}`;
const section = _find(app.book.data.numberedSections, {
  id: id,
}) as GenericSection;

// Setup navigation state
app.navigation.showAppbar = true;
app.navigation.showBottomNav = true;
app.navigation.title = section?.id as string;
app.addHistory(id, route.path);
app.book.isStarted = true;

// Setup page head
useHead({
  title: `Kai-Master - Section ${id}`,
});
</script>
