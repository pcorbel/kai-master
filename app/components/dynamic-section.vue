<template>
  <v-row v-for="paragraph in props.section.paragraphs" :key="paragraph.id">
    <v-col cols="12">
      <dynamic-paragraph :paragraph="paragraph" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const props = defineProps<{
  section: Section;
}>();
</script>
