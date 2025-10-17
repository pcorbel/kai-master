<template>
  <!-- The Bottom Navigation -->
  <v-bottom-navigation
    v-model="value"
    class="custom-border"
    bg-color="background"
    color="primary"
    elevation="0"
    grow
    mandatory
  >
    <v-btn :disabled="!app.book.isStarted" to="/history">
      <v-icon> mdi-history </v-icon>
    </v-btn>
    <v-btn
      @click="router.push(app.book.history[app.book.history.length - 1]!.path)"
    >
      <v-icon> mdi-book </v-icon>
    </v-btn>
    <v-btn to="/action-chart">
      <v-icon> mdi-account </v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup lang="ts">
// Define constants
const app = useAppStore();
const router = useRouter();
const value = ref(1);
</script>

<style scoped>
.custom-border {
  border-top: 1px solid rgb(var(--v-theme-border)) !important;
}
</style>
