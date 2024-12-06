<template>
  <!-- The App Bar -->
  <v-app-bar class="custom-border" color="background" flat>
    <v-app-bar-nav-icon @click="showDrawer = !showDrawer" />
    <v-toolbar-title class="font-weight-black">
      {{ app.navigation.title }}
    </v-toolbar-title>
  </v-app-bar>

  <!-- The Navigation Drawer -->
  <v-navigation-drawer
    v-model="showDrawer"
    color="background"
    elevation="0"
    temporary
    touchless
  >
    <v-list>
      <v-list-item to="/">
        <template v-slot:prepend>
          <v-icon color="primary" icon="mdi-book-multiple" />
        </template>
        <v-list-item-title> Books </v-list-item-title>
      </v-list-item>

      <v-list-group :value="false">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props">
            <template v-slot:prepend>
              <v-icon color="primary" icon="mdi-book-settings" />
            </template>
            <v-list-item-title> Rules </v-list-item-title>
          </v-list-item>
        </template>

        <v-list-item to="/dedication">
          {{ app.book.data.dedication.id }}
        </v-list-item>

        <v-list-item to="/acknowledgements">
          {{ app.book.data.acknowledgements.id }}
        </v-list-item>

        <v-list-item to="/the-story-so-far">
          {{ app.book.data.theStorySoFar.id }}
        </v-list-item>

        <v-list-item to="/the-game-rules">
          {{ app.book.data.theGameRules.id }}
        </v-list-item>

        <v-list-item to="/kai-disciplines">
          {{ app.book.data.kaiDisciplines.id }}
        </v-list-item>

        <v-list-item to="/equipment">
          {{ app.book.data.equipment.id }}
        </v-list-item>

        <v-list-item to="/combat-rules">
          {{ app.book.data.combatRules.id }}
        </v-list-item>

        <v-list-item to="/levels-of-kai-training">
          {{ app.book.data.kaiLevels.id }}
        </v-list-item>

        <v-list-item to="/kai-wisdom">
          {{ app.book.data.kaiWisdom.id }}
        </v-list-item>
      </v-list-group>

      <v-list-item to="/license">
        <template v-slot:prepend>
          <v-icon color="primary" icon="mdi-license" />
        </template>
        <v-list-item-title> License </v-list-item-title>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <v-divider />
      <v-list class="pa-0">
        <v-list-item class="pa-0">
          <v-btn
            class="no-uppercase"
            block
            href="https://github.com/pcorbel/kai-master"
            prepend-icon="mdi-github"
            target="_blank"
            variant="text"
          >
            View Source
          </v-btn>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
// Define constants
const app = useAppStore();
const showDrawer = ref(false);
</script>

<style scoped>
.custom-border {
  border-bottom: 1px solid rgb(var(--v-theme-border)) !important;
}
.no-uppercase {
  text-transform: none;
}
</style>
