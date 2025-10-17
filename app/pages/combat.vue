<template>
  <v-container class="h-100 text-justify">
    <!-- Header -->
    <v-row align="center" justify="center">
      <v-col class="font-weight-bold" align="start" cols="4">
        Lone Wolf Endurance
      </v-col>
      <v-col class="font-weight-bold" align="center" cols="4">
        Random Number
      </v-col>
      <v-col class="font-weight-bold" align="end" cols="4">
        {{ app.book.combat?.name }} Endurance
      </v-col>
    </v-row>

    <!-- Header Values -->
    <v-row v-for="step in app.book.combat?.steps" :key="step.id">
      <v-col align="start" cols="4">
        {{ step.loneWolfEndurance }}
      </v-col>
      <v-col align="center" cols="4">
        {{ step.randomNumber }}
      </v-col>
      <v-col align="end" cols="4">
        {{ step.enemyEndurance }}
      </v-col>
    </v-row>

    <!-- Combat Steps -->
    <v-row v-if="app.book.combat?.inProgress">
      <v-col cols="6">
        <v-btn
          block
          color="primary"
          to="/random-number-table"
          variant="flat"
          @click="app.book.combat.isEvading = true"
        >
          EVADE
        </v-btn>
      </v-col>

      <v-col cols="6">
        <v-btn block color="primary" to="/random-number-table" variant="flat">
          NEXT COMBAT STEP
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col>
        <v-btn block color="primary" variant="flat" @click="router.go(-1)">
          DONE
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Define constants
const app = useAppStore();
const router = useRouter();

// Setup navigation state
app.navigation.showAppbar = true;
app.navigation.showBottomNav = false;
app.navigation.title = "Combat";

// Setup page head
useHead({
  title: "Kai-Master - Combat",
});
</script>
