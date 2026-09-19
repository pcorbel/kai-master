<template>
  <rules-page section-key="kaiLevels" :next="next" />
</template>

<script setup lang="ts">
const app = useAppStore();

// Magnakai books continue with the Lore-circles, Grand Master books with the
// improved disciplines, Kai books go straight to Kai Wisdom.
const next = computed(() => {
  if (app.content?.loreCircles) return "/lore-circles";
  if (app.content?.improvedDisciplines) return "/improved-disciplines";
  return "/kai-wisdom";
});
</script>
