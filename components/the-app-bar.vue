<template>
  <!-- The App Bar -->
  <v-app-bar class="custom-border" color="background" flat>
    <v-app-bar-nav-icon @click="showDrawer = !showDrawer" />
    <v-toolbar-title class="font-weight-black text-truncate pr-3">
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
      <v-list-subheader> Kai-Master </v-list-subheader>

      <v-list-item @click="router.push('/')">
        <template v-slot:prepend>
          <v-icon color="primary" icon="mdi-home" />
        </template>
        <v-list-item-title> Library </v-list-item-title>
      </v-list-item>

      <v-divider />

      <v-list-subheader> {{ app.book.title }} </v-list-subheader>

      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props">
            <template v-slot:prepend>
              <v-icon color="primary" icon="mdi-book-settings" />
            </template>
            <v-list-item-title> Rules </v-list-item-title>
          </v-list-item>
        </template>

        <v-list-item @click="router.push('/dedication')">
          {{ app.book.data.dedication.id }}
        </v-list-item>

        <v-list-item @click="router.push('/acknowledgements')">
          {{ app.book.data.acknowledgements.id }}
        </v-list-item>

        <v-list-item @click="router.push('/the-story-so-far')">
          {{ app.book.data.theStorySoFar.id }}
        </v-list-item>

        <v-list-item @click="router.push('/the-game-rules')">
          {{ app.book.data.theGameRules.id }}
        </v-list-item>

        <v-list-item @click="router.push('/kai-disciplines')">
          {{ app.book.data.kaiDisciplines.id }}
        </v-list-item>

        <v-list-item @click="router.push('/equipment')">
          {{ app.book.data.equipment.id }}
        </v-list-item>

        <v-list-item @click="router.push('/combat-rules')">
          {{ app.book.data.combatRules.id }}
        </v-list-item>

        <v-list-item @click="router.push('/levels-of-kai-training')">
          {{ app.book.data.kaiLevels.id }}
        </v-list-item>

        <v-list-item
          v-if="app.book.serie === 'Magnakai'"
          @click="router.push('/lore-circles')"
        >
          {{ app.book.data.loreCircles.id }}
        </v-list-item>

        <v-list-item
          v-if="['Magnakai', 'Grand Master'].includes(app.book.serie)"
          @click="router.push('/improved-disciplines')"
        >
          {{ app.book.data.improvedDisciplines.id }}
        </v-list-item>

        <v-list-item @click="router.push('/kai-wisdom')">
          {{ app.book.data.kaiWisdom.id }}
        </v-list-item>
      </v-list-group>

      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props">
            <template v-slot:prepend>
              <v-icon color="primary" icon="mdi-book-arrow-right" />
            </template>
            <v-list-item-title> Sections </v-list-item-title>
          </v-list-item>
        </template>

        <v-list-item
          v-for="section in _orderBy(
            app.book.data.numberedSections,
            (s) => parseInt(s.id.replace('Section ', '')),
            'asc'
          )"
          :key="section.id"
          @click="router.push(`/section-${section.id.replace('Section ', '')}`)"
        >
          {{ section.id }}
        </v-list-item>
      </v-list-group>

      <v-list-item @click="router.push('/action-chart')">
        <template v-slot:prepend>
          <v-icon color="primary" icon="mdi-account" />
        </template>
        <v-list-item-title> Action Chart </v-list-item-title>
      </v-list-item>

      <v-list-item @click="router.push('/random-number-table')">
        <template v-slot:prepend>
          <v-icon color="primary" icon="mdi-dice-multiple" />
        </template>
        <v-list-item-title> Random Number Table </v-list-item-title>
      </v-list-item>

      <v-list-item @click="router.push('/history')">
        <template v-slot:prepend>
          <v-icon color="primary" icon="mdi-history" />
        </template>
        <v-list-item-title> History </v-list-item-title>
      </v-list-item>

      <v-list-item @click="router.push('/license')">
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
            href="https://github.com/pcorbel/kai-master/issues/new"
            prepend-icon="mdi-bug"
            target="_blank"
            variant="text"
          >
            Report a bug
          </v-btn>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
// Define constants
const app = useAppStore();
const router = useRouter();
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
