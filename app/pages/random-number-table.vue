<template>
  <v-container
    v-if="randomNumber === -1"
    class="h-100 d-flex flex-column"
    align-items="stretch"
  >
    <v-row
      v-for="(row, rowIndex) in app.book.randomNumberTable"
      :key="rowIndex"
      align="center"
    >
      <v-col
        v-for="number in row"
        :key="`${rowIndex}-${number}`"
        class="clickable"
        align="center"
        @click="select(number)"
      >
        {{ number }}
      </v-col>
    </v-row>
  </v-container>

  <v-container v-else class="h-100" @click="router.go(-1)">
    <v-row class="h-100" align="center">
      <v-col class="text-h1 text-center">
        {{ randomNumber }}
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Define constants
const app = useAppStore();
const router = useRouter();
const randomNumber = ref(-1);

// Setup navigation state
app.navigation.showAppbar = true;
app.navigation.showBottomNav = false;
app.navigation.title = "Random Number Table";

// Setup page head
useHead({
  title: "Kai-Master - Random Number Table",
});

// Define functions
function select(number: number) {
  randomNumber.value = number;
  if (app.book.combat?.inProgress) {
    app.handleCombatStep(number);
  }
}
</script>

<style scoped>
.clickable {
  cursor: pointer;
}
</style>
