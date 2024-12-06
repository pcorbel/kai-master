<template>
  <!-- Random Number Table Link -->
  <nuxt-link class="custom-link" to="/random-number-table" variant="text">
    <span class="link-content">
      <v-icon class="mr-1" size="1em"> mdi-dice-multiple </v-icon>
      Random Number Table
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
