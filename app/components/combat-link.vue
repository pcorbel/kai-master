<template>
  <!-- Combat Link -->
  <nuxt-link
    class="custom-link"
    to="/combat"
    variant="text"
    @click.stop="goToCombat()"
  >
    <span class="link-content">
      <v-icon class="mr-1" size="1em"> mdi-sword-cross </v-icon>
      {{ props.name }}: COMBAT SKILL {{ props.combatSkill }} ENDURANCE
      {{ props.endurance }}
    </span>
  </nuxt-link>
</template>

<script setup lang="ts">
const app = useAppStore();
const router = useRouter();
const props = defineProps<{
  name: string;
  combatSkill: string;
  endurance: string;
}>();

// Define functions
function goToCombat() {
  const combatRatio =
    app.book.actionChart.combatSkill - parseInt(props.combatSkill);
  app.book.combat = {
    name: props.name,
    loneWolfCombatSkill: app.book.actionChart.combatSkill,
    enemyCombatSkill: parseInt(props.combatSkill),
    combatRatio: combatRatio,
    boundedCombatRatio: Math.max(-11, Math.min(11, combatRatio)),
    steps: [
      {
        id: 0,
        loneWolfEndurance: app.book.actionChart.endurance,
        enemyEndurance: parseInt(props.endurance),
        randomNumber: null,
      },
    ],
    inProgress: true,
    isEvading: false,
  };
  router.push("/combat");
}
</script>

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
