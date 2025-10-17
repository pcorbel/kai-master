<template>
  <!-- Continue Button -->
  <v-row>
    <v-col>
      <v-btn block color="primary" :to="props.to" variant="flat">
        CONTINUE
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const props = defineProps<{
  to: string;
}>();
</script>
