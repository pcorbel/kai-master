<template>
  <v-container class="h-100 text-justify">
    <dynamic-section v-if="section" :section="section" />
    <continue-button v-if="section && props.next" :to="props.next" />
  </v-container>
</template>

<script setup lang="ts">
/**
 * Renders one of the book's rules / front-matter pages and wires up the
 * navigation chrome. Used by every page that is not a numbered section.
 */
const props = defineProps<{
  sectionKey: keyof BookContent;
  next?: string;
  /** Record the visit in the history (default true). */
  track?: boolean;
}>();

const app = useAppStore();
const route = useRoute();

const section = computed(() => app.content?.[props.sectionKey] as Section | undefined);

if (!section.value) {
  // The page does not exist for this series (e.g. Lore-circles in a Kai book).
  await navigateTo(props.next ?? "/", { replace: true });
} else {
  app.navigation.showAppbar = true;
  app.navigation.showBottomNav = true;
  app.navigation.title = section.value.title;
  if (props.track !== false) app.addHistory(section.value.title, route.path);
  useHead({ title: `Kai-Master - ${section.value.title}` });
}
</script>
