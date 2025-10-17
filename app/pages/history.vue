<template>
  <v-container class="h-100 text-justify">
    <v-row>
      <v-col cols="12">
        <v-list bg-color="background" lines="two">
          <v-list-item
            v-for="(item, index) in history"
            :key="index"
            :to="item.path"
          >
            <v-list-item-title>
              {{ item.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ $dayjs(item.timestamp).fromNow() }}
            </v-list-item-subtitle>
            <template v-slot:append>
              <v-btn
                color="primary"
                icon="mdi-book-arrow-right"
                variant="text"
              />
            </template>
          </v-list-item>
        </v-list>
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
app.navigation.title = "History";
let history = _orderBy(app.book.history, "id", "desc");
history = _filter(history, function (page) {
  return page.path.startsWith("/section-");
});

// Setup page head
useHead({
  title: "Kai-Master - History",
});
</script>
