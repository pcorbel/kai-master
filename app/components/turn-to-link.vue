<template>
  <!-- Turn To Link -->
  <nuxt-link
    class="custom-link"
    :to="`/section-${props.number}`"
    variant="text"
  >
    <span class="link-content">
      <v-icon class="mr-1" size="1em"> mdi-book-arrow-right </v-icon>
      {{ props.text }}
    </span>
  </nuxt-link>
</template>

<script setup lang="ts">
// Define constants
const props = defineProps<{
  number: string;
  text: string;
}>();
</script>

<style scoped>
.custom-link {
  text-decoration: none;
  color: rgb(var(--v-theme-primary)) !important;
}

.link-content {
  display: inline-flex;
  align-items: center;
}

.link-content .v-icon {
  vertical-align: middle;
}
</style>
