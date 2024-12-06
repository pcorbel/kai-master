<template>
  <!-- Action Chart Link -->
  <nuxt-link class="custom-link" to="/action-chart" variant="text">
    <span class="link-content">
      <v-icon class="mr-1" size="1em"> mdi-account </v-icon>
      Action Chart
    </span>
  </nuxt-link>
</template>

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
