<template>
  <!-- Loading Overlay -->
  <v-overlay
    class="align-center justify-center"
    :model-value="app.downloadInProgress"
    opacity="0.8"
    scrim="background"
  >
    <div class="align-center d-flex flex-column">
      <v-progress-circular class="mb-4" color="primary" indeterminate />
      <span class="font-weight-bold text-center text-text">
        Downloading {{ app.book.title }}
      </span>
    </div>
  </v-overlay>
</template>


<script setup lang="ts">
// Define constants
const app = useAppStore();
</script>
