<template>
  <!-- Action Chart Link -->
  <nuxt-link
    class="custom-link"
    to="/action-chart"
  >
    <span class="link-content">
      <v-icon
        class="mr-1"
        size="1em"
      > mdi-account </v-icon>
      {{ props.text ?? "Action Chart" }}
    </span>
  </nuxt-link>
</template>

<script setup lang="ts">
const props = defineProps<{
  text?: string;
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
</style>
