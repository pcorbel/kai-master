<template>
  <v-container class="h-100 text-justify">
    <!-- Lone Wolf Attributes -->
    <v-row align="center" justify="center">
      <v-col cols="12" justify="center">
        <span class="font-weight-bold text-h5"> Lone Wolf </span>
      </v-col>
    </v-row>

    <v-row align="center" justify="center">
      <v-col align="left" cols="8" justify="center"> COMBAT SKILL </v-col>
      <v-col align="right" cols="4" justify="center">
        <v-row align="center" justify="space-between" no-gutters>
          <v-col cols="auto">
            <v-btn
              density="compact"
              icon="mdi-minus"
              variant="text"
              @click="app.adjustCombatSkill(-1)"
            />
          </v-col>
          <v-col class="text-center">
            {{ app.book.actionChart.combatSkill }} /
            {{ app.book.actionChart.maxCombatSkill }}
          </v-col>
          <v-col cols="auto">
            <v-btn
              density="compact"
              icon="mdi-plus"
              variant="text"
              @click="app.adjustCombatSkill(1)"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row align="center" justify="center">
      <v-col align="left" cols="8" justify="center"> ENDURANCE </v-col>
      <v-col align="right" cols="4" justify="center">
        <v-row align="center" justify="space-between" no-gutters>
          <v-col cols="auto">
            <v-btn
              density="compact"
              icon="mdi-minus"
              variant="text"
              @click="app.adjustEndurance(-1)"
            />
          </v-col>
          <v-col class="text-center">
            {{ app.book.actionChart.endurance }} /
            {{ app.book.actionChart.maxEndurance }}
          </v-col>
          <v-col cols="auto">
            <v-btn
              density="compact"
              icon="mdi-plus"
              variant="text"
              @click="app.adjustEndurance(1)"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row align="center" justify="center">
      <v-col align="left" cols="8" justify="center"> Belt Pouch </v-col>
      <v-col align="right" cols="4" justify="center">
        <v-row align="center" justify="space-between" no-gutters>
          <v-col cols="auto">
            <v-btn
              density="compact"
              icon="mdi-minus"
              variant="text"
              @click="app.adjustBeltPouch(-1)"
            />
          </v-col>
          <v-col class="text-center">
            {{ app.book.actionChart.beltPouch }} / {{ BELT_POUCH_MAX }}
          </v-col>
          <v-col cols="auto">
            <v-btn
              density="compact"
              icon="mdi-plus"
              variant="text"
              @click="app.adjustBeltPouch(1)"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row align="center" justify="center">
      <v-col align="left" cols="8" justify="center"> Meals </v-col>
      <v-col align="right" cols="4" justify="center">
        <v-row align="center" justify="space-between" no-gutters>
          <v-col cols="auto">
            <v-btn
              density="compact"
              icon="mdi-minus"
              variant="text"
              @click="app.adjustMeals(-1)"
            />
          </v-col>
          <v-col class="text-center">
            {{ app.book.actionChart.meals }}
          </v-col>
          <v-col cols="auto">
            <v-btn
              density="compact"
              icon="mdi-plus"
              variant="text"
              @click="app.adjustMeals(1)"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Item slots -->
    <template v-for="group in slotGroups" :key="group.key">
      <v-row align="center" justify="center">
        <v-col cols="12" justify="center">
          <span class="font-weight-bold text-h5"> {{ group.title }} </span>
        </v-col>
      </v-row>

      <v-row align="center" justify="center">
        <v-col
          v-for="index in group.count"
          :key="index"
          class="py-0"
          cols="12"
          justify="center"
        >
          <v-text-field
            v-model="app.book.actionChart[group.key][index - 1]"
            clearable
            :label="`${group.label} #${index}`"
          />
        </v-col>
      </v-row>
    </template>

    <!-- Notes -->
    <v-row align="center" justify="center">
      <v-col cols="12" justify="center">
        <span class="font-weight-bold text-h5"> Notes </span>
      </v-col>
    </v-row>

    <v-row align="center" justify="center">
      <v-col cols="12" justify="center">
        <v-textarea v-model="app.book.actionChart.notes" clearable />
      </v-col>
    </v-row>

    <!-- Map -->
    <v-row align="center" justify="center">
      <v-col cols="12" justify="center">
        <span class="font-weight-bold text-h5"> {{ app.content!.kaiMap.title }} </span>
      </v-col>
    </v-row>

    <dynamic-section :section="app.content!.kaiMap" />
  </v-container>
</template>

<script setup lang="ts">
const app = useAppStore();

// Kai books grant fewer disciplines than Magnakai / Grand Master books.
const slotGroups = computed(() => [
  {
    key: "kaiDisciplines" as const,
    title: "Kai-Disciplines",
    label: "Kai-Discipline",
    count: Math.min(app.meta.disciplines, ACTION_CHART_SLOTS.kaiDisciplines),
  },
  { key: "weapons" as const, title: "Weapons", label: "Weapon", count: ACTION_CHART_SLOTS.weapons },
  {
    key: "backpackItems" as const,
    title: "Backpack Items",
    label: "Backpack Item",
    count: ACTION_CHART_SLOTS.backpackItems,
  },
  {
    key: "specialItems" as const,
    title: "Special Items",
    label: "Special Item",
    count: ACTION_CHART_SLOTS.specialItems,
  },
]);

// Setup navigation state
app.navigation.showAppbar = true;
app.navigation.showBottomNav = true;
app.navigation.title = "Action Chart";

// Setup page head
useHead({
  title: "Kai-Master - Action Chart",
});
</script>
