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
              @click="app.decreaseCombatSkill(1)"
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
              @click="app.increaseCombatSkill(1)"
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
              @click="app.decreaseEndurance(1)"
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
              @click="app.increaseEndurance(1)"
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
              @click="app.decreaseBeltPouch(1)"
            />
          </v-col>
          <v-col class="text-center">
            {{ app.book.actionChart.beltPouch }} / 50
          </v-col>
          <v-col cols="auto">
            <v-btn
              density="compact"
              icon="mdi-plus"
              variant="text"
              @click="app.increaseBeltPouch(1)"
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
              @click="app.decreaseMeals(1)"
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
              @click="app.increaseMeals(1)"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Kai Disciplines -->
    <v-row align="center" justify="center">
      <v-col cols="12" justify="center">
        <span class="font-weight-bold text-h5"> Kai-Disciplines </span>
      </v-col>
    </v-row>

    <v-row align="center" justify="center">
      <v-col class="pb-0" cols="12" justify="center">
        <v-text-field
          v-model="app.book.actionChart.kaiDisciplines.kaiDiscipline1"
          clearable
          label="Kai-Discipline #1"
        />
      </v-col>
      <v-col class="py-0" cols="12" justify="center">
        <v-text-field
          v-model="app.book.actionChart.kaiDisciplines.kaiDiscipline2"
          clearable
          label="Kai-Discipline #2"
        />
      </v-col>
      <v-col class="py-0" cols="12" justify="center">
        <v-text-field
          v-model="app.book.actionChart.kaiDisciplines.kaiDiscipline3"
          clearable
          label="Kai-Discipline #3"
        />
      </v-col>
      <v-col class="py-0" cols="12" justify="center">
        <v-text-field
          v-model="app.book.actionChart.kaiDisciplines.kaiDiscipline4"
          clearable
          label="Kai-Discipline #4"
        />
      </v-col>
      <v-col class="pt-0" cols="12" justify="center">
        <v-text-field
          v-model="app.book.actionChart.kaiDisciplines.kaiDiscipline5"
          clearable
          label="Kai-Discipline #5"
        />
      </v-col>
      <v-col
        v-if="app.book.disciplines > 5"
        class="pt-0"
        cols="12"
        justify="center"
      >
        <v-text-field
          v-model="app.book.actionChart.kaiDisciplines.kaiDiscipline6"
          clearable
          label="Kai-Discipline #6"
        />
      </v-col>
      <v-col
        v-if="app.book.disciplines > 6"
        class="pt-0"
        cols="12"
        justify="center"
      >
        <v-text-field
          v-model="app.book.actionChart.kaiDisciplines.kaiDiscipline7"
          clearable
          label="Kai-Discipline #7"
        />
      </v-col>
      <v-col
        v-if="app.book.disciplines > 7"
        class="pt-0"
        cols="12"
        justify="center"
      >
        <v-text-field
          v-model="app.book.actionChart.kaiDisciplines.kaiDiscipline8"
          clearable
          label="Kai-Discipline #8"
        />
      </v-col>
      <v-col
        v-if="app.book.disciplines > 8"
        class="pt-0"
        cols="12"
        justify="center"
      >
        <v-text-field
          v-model="app.book.actionChart.kaiDisciplines.kaiDiscipline9"
          clearable
          label="Kai-Discipline #9"
        />
      </v-col>
      <v-col
        v-if="app.book.disciplines > 9"
        class="pt-0"
        cols="12"
        justify="center"
      >
        <v-text-field
          v-model="app.book.actionChart.kaiDisciplines.kaiDiscipline10"
          clearable
          label="Kai-Discipline #10"
        />
      </v-col>
      <v-col
        v-if="app.book.disciplines > 10"
        class="pt-0"
        cols="12"
        justify="center"
      >
        <v-text-field
          v-model="app.book.actionChart.kaiDisciplines.kaiDiscipline11"
          clearable
          label="Kai-Discipline #11"
        />
      </v-col>
      <v-col
        v-if="app.book.disciplines > 11"
        class="pt-0"
        cols="12"
        justify="center"
      >
        <v-text-field
          v-model="app.book.actionChart.kaiDisciplines.kaiDiscipline12"
          clearable
          label="Kai-Discipline #12"
        />
      </v-col>
    </v-row>

    <!-- Weapons -->
    <v-row align="center" justify="center">
      <v-col cols="12" justify="center">
        <span class="font-weight-bold text-h5"> Weapons </span>
      </v-col>
    </v-row>

    <v-row align="center" justify="center">
      <v-col class="pb-0" cols="12" justify="center">
        <v-text-field
          v-model="app.book.actionChart.weapons.weapon1"
          clearable
          label="Weapon #1"
        />
      </v-col>
      <v-col class="pt-0" cols="12" justify="center">
        <v-text-field
          v-model="app.book.actionChart.weapons.weapon2"
          clearable
          label="Weapon #2"
        />
      </v-col>
    </v-row>

    <!-- Backpack Items -->
    <v-row align="center" justify="center">
      <v-col cols="12" justify="center">
        <span class="font-weight-bold text-h5"> Backpack Items </span>
      </v-col>
    </v-row>

    <v-row align="center" justify="center">
      <v-col class="pb-0" cols="12" justify="center">
        <v-text-field
          v-model="app.book.actionChart.backpackItems.backpackItem1"
          clearable
          label="Backpack Item #1"
        />
      </v-col>
      <v-col class="py-0" cols="12" justify="center">
        <v-text-field
          v-model="app.book.actionChart.backpackItems.backpackItem2"
          clearable
          label="Backpack Item #2"
        />
      </v-col>
      <v-col class="py-0" cols="12" justify="center">
        <v-text-field
          v-model="app.book.actionChart.backpackItems.backpackItem3"
          clearable
          label="Backpack Item #3"
        />
      </v-col>
      <v-col class="py-0" cols="12" justify="center">
        <v-text-field
          v-model="app.book.actionChart.backpackItems.backpackItem4"
          clearable
          label="Backpack Item #4"
        />
      </v-col>
      <v-col class="py-0" cols="12" justify="center">
        <v-text-field
          v-model="app.book.actionChart.backpackItems.backpackItem5"
          clearable
          label="Backpack Item #5"
        />
      </v-col>
      <v-col class="py-0" cols="12" justify="center">
        <v-text-field
          v-model="app.book.actionChart.backpackItems.backpackItem6"
          clearable
          label="Backpack Item #6"
        />
      </v-col>
      <v-col class="py-0" cols="12" justify="center">
        <v-text-field
          v-model="app.book.actionChart.backpackItems.backpackItem7"
          clearable
          label="Backpack Item #7"
        />
      </v-col>
      <v-col class="pt-0" cols="12" justify="center">
        <v-text-field
          v-model="app.book.actionChart.backpackItems.backpackItem8"
          clearable
          label="Backpack Item #8"
        />
      </v-col>
    </v-row>

    <!-- Special Items -->
    <v-row align="center" justify="center">
      <v-col cols="12" justify="center">
        <span class="font-weight-bold text-h5"> Special Items </span>
      </v-col>
    </v-row>

    <v-row align="center" justify="center">
      <v-col class="pb-0" cols="12" justify="center">
        <v-text-field
          v-model="app.book.actionChart.specialItems.specialItem1"
          clearable
          label="Special Item #1"
        />
      </v-col>
      <v-col class="py-0" cols="12" justify="center">
        <v-text-field
          v-model="app.book.actionChart.specialItems.specialItem2"
          clearable
          label="Special Item #2"
        />
      </v-col>
      <v-col class="py-0" cols="12" justify="center">
        <v-text-field
          v-model="app.book.actionChart.specialItems.specialItem3"
          clearable
          label="Special Item #3"
        />
      </v-col>
      <v-col class="py-0" cols="12" justify="center">
        <v-text-field
          v-model="app.book.actionChart.specialItems.specialItem4"
          clearable
          label="Special Item #4"
        />
      </v-col>
      <v-col class="py-0" cols="12" justify="center">
        <v-text-field
          v-model="app.book.actionChart.specialItems.specialItem5"
          clearable
          label="Special Item #5"
        />
      </v-col>
      <v-col class="py-0" cols="12" justify="center">
        <v-text-field
          v-model="app.book.actionChart.specialItems.specialItem6"
          clearable
          label="Special Item #6"
        />
      </v-col>
      <v-col class="py-0" cols="12" justify="center">
        <v-text-field
          v-model="app.book.actionChart.specialItems.specialItem7"
          clearable
          label="Special Item #7"
        />
      </v-col>
      <v-col class="py-0" cols="12" justify="center">
        <v-text-field
          v-model="app.book.actionChart.specialItems.specialItem8"
          clearable
          label="Special Item #8"
        />
      </v-col>
      <v-col class="py-0" cols="12" justify="center">
        <v-text-field
          v-model="app.book.actionChart.specialItems.specialItem9"
          clearable
          label="Special Item #9"
        />
      </v-col>
      <v-col class="py-0" cols="12" justify="center">
        <v-text-field
          v-model="app.book.actionChart.specialItems.specialItem10"
          clearable
          label="Special Item #10"
        />
      </v-col>
      <v-col class="py-0" cols="12" justify="center">
        <v-text-field
          v-model="app.book.actionChart.specialItems.specialItem11"
          clearable
          label="Special Item #11"
        />
      </v-col>
      <v-col class="pt-0" cols="12" justify="center">
        <v-text-field
          v-model="app.book.actionChart.specialItems.specialItem12"
          clearable
          label="Special Item #12"
        />
      </v-col>
    </v-row>

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
        <span font-weight-bold class="text-h5"> Map </span>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <dynamic-paragraph :content="app.book.data.kaiMap.paragraphs[0]" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Define constants
const app = useAppStore();

// Setup navigation state
app.navigation.showAppbar = true;
app.navigation.showBottomNav = true;
app.navigation.title = "Action Chart";

// Setup page head
useHead({
  title: "Kai-Master - Action Chart",
});
</script>
