<template>
  <!-- Combat Link -->
  <a
    class="custom-link"
    href="/combat"
    @click.prevent="goToCombat()"
  >
    <span class="link-content">
      <v-icon
        class="mr-1"
        size="1em"
      > mdi-sword-cross </v-icon>
      {{ props.enemy.name }}: COMBAT SKILL {{ props.enemy.combatSkill }} ENDURANCE
      <template v-if="props.enemy.enduranceLabel">({{ props.enemy.enduranceLabel }})</template>
      {{ props.enemy.endurance }}
    </span>
  </a>
</template>

<script setup lang="ts">
const app = useAppStore();
const router = useRouter();
const props = defineProps<{
  enemy: CombatStats;
}>();

function goToCombat() {
  app.startCombat(props.enemy);
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
</style>
