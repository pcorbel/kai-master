<template>
  <v-container class="d-flex flex-column h-100">
    <!-- Title -->
    <v-row class="flex-grow-0 mt-5">
      <v-col
        class="font-weight-black text-h3 text-primary pb-0"
        align="center"
        cols="12"
      >
        Kai-Master
      </v-col>
      <v-col class="text-h6" align="center" cols="12">
        A Modern Lone Wolf Reader
      </v-col>
    </v-row>

    <!-- Covers Carousel -->
    <v-row class="flex-grow-1" align="center">
      <v-col cols="12">
        <v-carousel
          v-model="currentBookIndex"
          class="elevation-0"
          hide-delimiters
          @update:model-value="app.loadBook(app.books[currentBookIndex].code)"
        >
          <template v-slot:prev="{ props }">
            <v-btn icon @click="props.onClick">
              <v-icon> mdi-chevron-left </v-icon>
            </v-btn>
          </template>

          <template v-slot:next="{ props }">
            <v-btn icon @click="props.onClick">
              <v-icon> mdi-chevron-right </v-icon>
            </v-btn>
          </template>

          <v-carousel-item v-for="book in app.books">
            <v-img :src="getCover(book)" />
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>

    <!-- Buttons and ToS -->
    <v-row class="flex-grow-0">
      <v-col class="pb-0" cols="12">
        <v-btn
          block
          color="primary"
          :disabled="!(app.isLicenseAccepted && _has(app, 'book.history'))"
          variant="flat"
          @click="loadGame()"
        >
          CONTINUE
        </v-btn>
      </v-col>

      <v-col class="pb-0" cols="12">
        <v-btn
          block
          color="primary"
          :disabled="!app.isLicenseAccepted"
          variant="flat"
          @click="
            app.book.isInitialized ? (showNewGameDialog = true) : newGame()
          "
        >
          NEW GAME
        </v-btn>
      </v-col>

      <v-col class="pt-0" cols="12">
        <v-checkbox v-model="app.isLicenseAccepted" hide-details>
          <template v-slot:label>
            <div>
              I agree to the
              <nuxt-link
                class="custom-link"
                href="https://www.projectaon.org/en/Main/License"
                target="_blank"
              >
                <span class="link-content"> Project Aon license terms </span>
              </nuxt-link>
            </div>
          </template>
        </v-checkbox>
      </v-col>
    </v-row>

    <!-- Confirmation Dialog -->
    <v-dialog :model-value="showNewGameDialog" contained>
      <v-card color="background" variant="flat">
        <v-card-title> New Game </v-card-title>

        <v-card-text class="text-justify">
          Starting a new game will erase your current progress. Are you sure you
          want to continue?
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="showNewGameDialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" @click="newGame()"> Continue </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
// Define constants
const app = useAppStore();
const router = useRouter();
const showNewGameDialog = ref(false);
const currentBookIndex = ref(app.book.id - 1);

// Setup navigation state
app.navigation.showAppbar = false;
app.navigation.showBottomNav = false;
app.downloadInProgress = false;

// Setup page head
useHead({
  title: "Kai-Master - Books",
});

// Define functions
async function newGame() {
  showNewGameDialog.value = false;
  if (!app.downloadInProgress) {
    app.downloadInProgress = true;
    await app.fetchBook();
    app.downloadInProgress = false;
    if (app.book.data && Object.keys(app.book.data).length > 0) {
      router.push("/dedication");
    }
  }
}

function loadGame() {
  router.push(app.book.history[app.book.history.length - 1].path);
}

function getCover(book: Book) {
  return `https://git.projectaon.org/?p=project-aon.git;a=blob_plain;hb=HEAD;f=en/jpeg/lw/${book.code}/skins/ebook/cover.jpg`;
}
</script>

<style scoped>
.custom-link {
  color: rgb(var(--v-theme-primary)) !important;
}
</style>
