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
      <v-col
        class="text-h6"
        align="center"
        cols="12"
      >
        A Modern Lone Wolf Reader
      </v-col>
    </v-row>

    <!-- Covers Carousel -->
    <v-row
      class="flex-grow-1"
      align="center"
    >
      <v-col cols="12">
        <v-carousel
          v-model="currentBookIndex"
          class="elevation-0"
          hide-delimiters
          @update:model-value="selectBook"
        >
          <template #prev="{ props }">
            <v-btn
              icon
              @click="props.onClick"
            >
              <v-icon> mdi-chevron-left </v-icon>
            </v-btn>
          </template>

          <template #next="{ props }">
            <v-btn
              icon
              @click="props.onClick"
            >
              <v-icon> mdi-chevron-right </v-icon>
            </v-btn>
          </template>

          <v-carousel-item
            v-for="book in app.books"
            :key="book.code"
          >
            <v-img
              :alt="book.title"
              :src="`/covers/${book.code}.jpeg`"
            />
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>

    <!-- Buttons and ToS -->
    <v-row class="flex-grow-0">
      <v-col
        class="pb-0"
        cols="12"
      >
        <v-btn
          block
          color="primary"
          :disabled="!(app.isLicenseAccepted && canContinue)"
          variant="flat"
          @click="continueGame()"
        >
          CONTINUE
        </v-btn>
      </v-col>

      <v-col
        class="pb-0"
        cols="12"
      >
        <v-btn
          block
          color="primary"
          :disabled="!app.isLicenseAccepted"
          variant="flat"
          @click="canContinue ? (showNewGameDialog = true) : newGame()"
        >
          NEW GAME
        </v-btn>
      </v-col>

      <v-col
        class="pt-0"
        cols="12"
      >
        <v-checkbox
          v-model="app.isLicenseAccepted"
          hide-details
        >
          <template #label>
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
    <v-dialog
      v-model="showNewGameDialog"
      contained
    >
      <v-card
        color="background"
        variant="flat"
      >
        <v-card-title> New Game </v-card-title>

        <v-card-text class="text-justify">
          Starting a new game will erase your current progress in {{ app.meta.title }}. Are you
          sure you want to continue?
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            @click="showNewGameDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="newGame()"
          >
            Continue
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Download errors -->
    <v-snackbar
      v-model="showError"
      color="error"
      timeout="6000"
    >
      {{ errorMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
const app = useAppStore();
const router = useRouter();
const showNewGameDialog = ref(false);
const showError = ref(false);
const errorMessage = ref("");
const currentBookIndex = ref(Math.max(0, app.books.findIndex(book => book.code === app.book.code)));

const canContinue = computed(() => app.book.history.length > 0);

app.navigation.showAppbar = false;
app.navigation.showBottomNav = false;
app.downloadInProgress = false;

useHead({
  title: "Kai-Master - Books",
});

function selectBook(index: unknown) {
  const book = app.books[Number(index)];
  if (book) app.selectBook(book.code);
}

/** Runs a download-backed action behind the overlay and reports failures. */
async function withDownload(action: () => Promise<string>) {
  if (app.downloadInProgress) return;
  app.downloadInProgress = true;
  try {
    router.push(await action());
  }
  catch (error) {
    console.error(error);
    errorMessage.value = `Could not download ${app.meta.title}. Check your connection and try again.`;
    showError.value = true;
  }
  finally {
    app.downloadInProgress = false;
  }
}

function newGame() {
  showNewGameDialog.value = false;
  withDownload(async () => {
    await app.startNewGame();
    return "/dedication";
  });
}

function continueGame() {
  withDownload(async () => {
    await app.ensureContent();
    return app.resumePath ?? "/dedication";
  });
}
</script>

<style scoped>
.custom-link {
  color: rgb(var(--v-theme-primary)) !important;
}
</style>
