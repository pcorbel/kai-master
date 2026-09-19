<template>
  <v-container class="h-100 text-justify">
    <v-row>
      <v-col cols="12">
        <v-list bg-color="background" lines="two">
          <v-list-item v-for="item in history" :key="item.id" :to="item.path" :value="item.id">
            <v-list-item-title>
              {{ item.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ $dayjs(item.timestamp).fromNow() }}
            </v-list-item-subtitle>
            <template v-slot:append>
              <v-btn color="primary" icon="mdi-book-arrow-right" variant="text" />
            </template>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const app = useAppStore();

app.navigation.showAppbar = true;
app.navigation.showBottomNav = true;
app.navigation.title = "History";

// Most recent first, numbered sections only.
const history = computed(() =>
  [...app.book.history].reverse().filter((entry) => entry.path.startsWith("/section-"))
);

useHead({
  title: "Kai-Master - History",
});
</script>
