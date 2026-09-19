<template>
  <!-- Random Number Table Link -->
  <nuxt-link class="custom-link" to="/random-number-table">
    <span class="link-content">
      <v-icon class="mr-1" size="1em"> mdi-dice-multiple </v-icon>
      {{ props.text ?? "Random Number Table" }}
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
