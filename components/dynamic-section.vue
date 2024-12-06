<template>
  <v-row v-for="paragraph in props.section.paragraphs" :key="paragraph.id">
    <v-col cols="12">
      <dynamic-paragraph :content="paragraph" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
// Define constants
const props = defineProps<{
  section: GenericSection;
}>();
</script>
