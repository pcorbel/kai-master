<template>
  <v-container class="h-100 text-justify">
    <dynamic-section v-if="section" :section="section" />
    <v-row v-else>
      <v-col class="text-center" cols="12">
        <p class="mb-4">This section does not exist in {{ app.meta.title }}.</p>
        <v-btn color="primary" variant="flat" :to="app.resumePath ?? '/'"> Go back </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const app = useAppStore();
const route = useRoute();

const number = parseInt(route.params.id as string, 10);
const section = app.getSection(number);

app.navigation.showAppbar = true;
app.navigation.showBottomNav = true;
app.navigation.title = section?.title ?? `Section ${route.params.id}`;

if (section) {
  app.addHistory(section.title, route.path);
  app.book.isStarted = true;
}

useHead({
  title: `Kai-Master - ${app.navigation.title}`,
});
</script>
