import { defineStore } from "pinia";

// Define and export the main app store
export const useAppStore = defineStore("app", {
  // Define the initial state of the store
  state: () => ({
    downloadInProgress: false as boolean,
    isLicenseAccepted: false as boolean,
    navigation: {
      showAppbar: false as boolean,
      showBottomNav: false as boolean,
      title: "" as string,
    },
    book: {
      id: 1,
      title: "Flight from the Dark",
      code: "01fftd",
      serie: "Kai",
      disciplines: 5,
      isInitialized: false,
    } as Book,
    // Array of available Lone Wolf books
    books: [
      {
        id: 1,
        title: "Flight from the Dark",
        code: "01fftd",
        serie: "Kai",
        disciplines: 5,
        isInitialized: false,
        randomNumberTable: [
          [1, 5, 7, 3, 6, 9, 0, 1, 7, 9],
          [3, 9, 2, 8, 1, 7, 4, 9, 7, 8],
          [6, 1, 0, 7, 3, 0, 5, 4, 6, 7],
          [0, 2, 8, 9, 2, 9, 6, 0, 2, 4],
          [5, 9, 6, 4, 8, 2, 8, 5, 6, 3],
          [0, 3, 1, 3, 9, 7, 5, 0, 1, 5],
          [5, 8, 2, 5, 1, 3, 6, 4, 3, 9],
          [7, 0, 4, 8, 6, 4, 5, 1, 4, 2],
          [4, 6, 8, 3, 2, 0, 1, 7, 2, 5],
          [8, 3, 7, 0, 9, 6, 2, 4, 8, 1],
        ],
      },
      {
        id: 2,
        title: "Fire on the Water",
        code: "02fotw",
        serie: "Kai",
        disciplines: 6,
        isInitialized: false,
        randomNumberTable: [
          [7, 5, 0, 1, 5, 1, 5, 7, 3, 6],
          [3, 6, 4, 3, 9, 3, 9, 2, 8, 1],
          [4, 5, 1, 4, 2, 6, 1, 0, 7, 3],
          [0, 1, 7, 2, 5, 0, 2, 8, 9, 2],
          [6, 2, 4, 8, 1, 5, 9, 6, 4, 8],
          [9, 0, 1, 7, 9, 0, 3, 1, 3, 9],
          [7, 4, 9, 7, 8, 5, 8, 2, 5, 1],
          [0, 5, 4, 6, 7, 7, 0, 4, 8, 6],
          [9, 6, 0, 2, 4, 4, 6, 8, 3, 2],
          [2, 8, 5, 6, 3, 8, 3, 7, 0, 9],
        ],
      },
      {
        id: 3,
        title: "The Caverns of Kalte",
        code: "03tcok",
        serie: "Kai",
        disciplines: 7,
        isInitialized: false,
        randomNumberTable: [
          [0, 3, 1, 3, 9, 7, 5, 0, 1, 5],
          [5, 8, 2, 5, 1, 3, 6, 4, 3, 9],
          [7, 0, 4, 8, 6, 4, 5, 1, 4, 2],
          [4, 6, 8, 3, 2, 0, 1, 7, 2, 5],
          [8, 3, 7, 0, 9, 6, 2, 4, 8, 1],
          [1, 5, 7, 3, 6, 9, 0, 1, 7, 9],
          [3, 9, 2, 8, 1, 7, 4, 9, 7, 8],
          [6, 1, 0, 7, 3, 0, 5, 4, 6, 7],
          [0, 2, 8, 9, 2, 9, 6, 0, 2, 4],
          [5, 9, 6, 4, 8, 2, 8, 5, 6, 3],
        ],
      },
      {
        id: 4,
        title: "The Chasm of Doom",
        code: "04tcod",
        serie: "Kai",
        disciplines: 8,
        isInitialized: false,
        randomNumberTable: [
          [1, 3, 9, 3, 2, 7, 5, 0, 2, 5],
          [5, 6, 2, 5, 1, 3, 8, 4, 3, 5],
          [7, 6, 7, 8, 1, 4, 3, 1, 4, 5],
          [4, 0, 8, 7, 3, 0, 8, 7, 2, 5],
          [7, 4, 0, 0, 9, 6, 2, 0, 8, 1],
          [1, 6, 7, 9, 6, 9, 0, 3, 3, 9],
          [8, 9, 2, 8, 1, 3, 4, 9, 7, 1],
          [6, 3, 0, 7, 5, 0, 5, 4, 6, 6],
          [7, 2, 1, 4, 2, 9, 6, 4, 2, 6],
          [0, 9, 6, 4, 8, 2, 8, 5, 8, 3],
        ],
      },
      {
        id: 5,
        title: "Shadow on the Sand",
        code: "05sots",
        serie: "Kai",
        disciplines: 9,
        isInitialized: false,
        randomNumberTable: [
          [2, 5, 0, 4, 8, 6, 6, 8, 4, 1],
          [0, 5, 9, 5, 7, 0, 9, 4, 6, 5],
          [2, 8, 2, 5, 6, 3, 2, 7, 9, 6],
          [1, 6, 8, 4, 0, 4, 1, 3, 8, 7],
          [7, 5, 6, 2, 0, 4, 1, 6, 3, 1],
          [6, 6, 8, 4, 1, 2, 5, 0, 4, 8],
          [0, 9, 4, 6, 5, 0, 5, 9, 5, 7],
          [3, 2, 7, 9, 6, 2, 8, 2, 5, 6],
          [4, 1, 3, 8, 7, 1, 6, 8, 4, 0],
          [4, 1, 6, 3, 1, 7, 5, 6, 2, 0],
        ],
      },
      {
        id: 6,
        title: "The Kingdoms of Terror",
        code: "06tkot",
        serie: "Magnakai",
        disciplines: 3,
        isInitialized: false,
        randomNumberTable: [
          [9, 3, 1, 2, 8, 1, 4, 7, 7, 2],
          [6, 3, 8, 8, 8, 5, 4, 9, 3, 1],
          [9, 5, 6, 6, 5, 7, 6, 3, 6, 7],
          [2, 5, 0, 4, 8, 6, 6, 8, 7, 2],
          [0, 5, 9, 5, 7, 0, 9, 4, 4, 1],
          [2, 8, 2, 5, 6, 7, 3, 2, 5, 6],
          [3, 4, 8, 0, 7, 1, 4, 8, 4, 0],
          [6, 2, 0, 4, 6, 1, 1, 4, 2, 0],
          [0, 5, 6, 6, 2, 1, 8, 4, 1, 6],
          [4, 6, 5, 6, 0, 5, 9, 0, 1, 5],
        ],
      },
      {
        id: 7,
        title: "Castle Death",
        code: "07cd",
        serie: "Magnakai",
        disciplines: 4,
        isInitialized: false,
        randomNumberTable: [
          [9, 3, 1, 2, 8, 1, 4, 7, 7, 2],
          [6, 3, 8, 8, 8, 5, 4, 9, 3, 1],
          [9, 5, 6, 6, 5, 7, 6, 3, 6, 7],
          [2, 5, 0, 4, 8, 6, 6, 8, 7, 2],
          [0, 5, 9, 5, 7, 0, 9, 4, 4, 1],
          [2, 8, 2, 5, 6, 7, 3, 2, 5, 6],
          [3, 4, 8, 0, 7, 1, 4, 8, 4, 0],
          [6, 2, 0, 4, 6, 1, 1, 4, 2, 0],
          [0, 5, 6, 6, 2, 1, 8, 4, 1, 6],
          [4, 6, 5, 6, 0, 5, 9, 0, 1, 5],
        ],
      },
      {
        id: 8,
        title: "The Jungle of Horrors",
        code: "08tjoh",
        serie: "Magnakai",
        disciplines: 5,
        isInitialized: false,
        randomNumberTable: [
          [3, 5, 8, 9, 0, 8, 7, 4, 5, 7],
          [2, 7, 0, 4, 6, 8, 2, 5, 6, 4],
          [0, 4, 8, 4, 4, 7, 9, 0, 5, 4],
          [7, 6, 3, 6, 9, 6, 5, 6, 0, 2],
          [2, 2, 8, 4, 6, 8, 9, 6, 2, 8],
          [8, 4, 2, 8, 2, 3, 7, 2, 9, 5],
          [4, 9, 7, 5, 1, 3, 7, 2, 0, 8],
          [9, 6, 5, 3, 1, 6, 4, 8, 0, 3],
          [6, 3, 9, 1, 6, 6, 1, 2, 8, 8],
          [6, 4, 8, 0, 5, 6, 5, 0, 8, 1],
        ],
      },
      {
        id: 9,
        title: "The Cauldron of Fear",
        code: "09tcof",
        serie: "Magnakai",
        disciplines: 6,
        isInitialized: false,
        randomNumberTable: [
          [4, 0, 4, 8, 7, 4, 0, 9, 7, 5],
          [7, 6, 3, 6, 9, 6, 5, 6, 0, 2],
          [5, 8, 9, 3, 8, 0, 4, 7, 4, 5],
          [2, 7, 0, 4, 6, 8, 2, 5, 6, 4],
          [4, 8, 2, 4, 2, 3, 8, 2, 9, 5],
          [8, 2, 6, 8, 6, 7, 9, 8, 2, 8],
          [3, 0, 8, 4, 6, 1, 3, 5, 6, 9],
          [8, 0, 2, 7, 3, 5, 1, 7, 9, 4],
          [3, 8, 6, 5, 8, 1, 6, 8, 2, 6],
          [0, 8, 4, 6, 1, 0, 1, 6, 9, 5],
        ],
      },
      {
        id: 10,
        title: "The Dungeons of Torgar",
        code: "10tdot",
        serie: "Magnakai",
        disciplines: 7,
        isInitialized: false,
        randomNumberTable: [
          [4, 0, 4, 8, 7, 4, 0, 9, 7, 5],
          [7, 6, 3, 6, 9, 6, 5, 6, 0, 2],
          [5, 8, 9, 3, 8, 0, 4, 7, 4, 5],
          [2, 7, 0, 4, 6, 8, 2, 5, 6, 4],
          [4, 8, 2, 4, 2, 3, 8, 2, 9, 5],
          [8, 2, 6, 8, 6, 7, 9, 8, 2, 8],
          [3, 0, 8, 4, 6, 1, 3, 5, 6, 9],
          [8, 0, 2, 7, 3, 5, 1, 7, 9, 4],
          [3, 8, 6, 5, 8, 1, 6, 8, 2, 6],
          [0, 8, 4, 6, 1, 0, 1, 6, 9, 5],
        ],
      },
      {
        id: 11,
        title: "The Prisoners of Time",
        code: "11tpot",
        serie: "Magnakai",
        disciplines: 8,
        isInitialized: false,
        randomNumberTable: [
          [4, 0, 9, 7, 5, 8, 2, 6, 8, 6],
          [6, 5, 6, 0, 2, 3, 0, 8, 4, 6],
          [0, 4, 7, 4, 5, 8, 0, 2, 7, 3],
          [8, 2, 6, 5, 4, 3, 8, 6, 5, 8],
          [3, 8, 2, 9, 5, 0, 8, 4, 6, 1],
          [7, 9, 8, 2, 8, 4, 0, 4, 8, 7],
          [1, 3, 5, 6, 9, 7, 6, 3, 6, 9],
          [5, 1, 7, 9, 4, 5, 8, 9, 3, 8],
          [1, 6, 8, 2, 6, 2, 7, 0, 4, 6],
          [0, 1, 6, 9, 5, 4, 8, 2, 4, 2],
        ],
      },
      {
        id: 12,
        title: "The Masters of Darkness",
        code: "12tmod",
        serie: "Magnakai",
        disciplines: 9,
        isInitialized: false,
        randomNumberTable: [
          [4, 0, 9, 7, 5, 8, 2, 6, 8, 6],
          [6, 5, 6, 0, 2, 3, 0, 8, 4, 6],
          [0, 4, 7, 4, 5, 8, 0, 2, 7, 3],
          [8, 2, 6, 5, 4, 3, 8, 6, 5, 8],
          [3, 8, 2, 9, 5, 0, 8, 4, 6, 1],
          [7, 9, 8, 2, 8, 4, 0, 4, 8, 7],
          [1, 3, 5, 6, 9, 7, 6, 3, 6, 9],
          [5, 1, 7, 9, 4, 5, 8, 9, 3, 8],
          [1, 6, 8, 2, 6, 2, 7, 0, 4, 6],
          [0, 1, 6, 9, 5, 4, 8, 2, 4, 2],
        ],
      },
      {
        id: 13,
        title: "The Plague Lords of Ruel",
        code: "13tplor",
        serie: "Grand Master",
        disciplines: 4,
        isInitialized: false,
        randomNumberTable: [
          [8, 2, 6, 1, 3, 1, 7, 8, 6, 2],
          [3, 8, 6, 5, 0, 3, 8, 7, 8, 1],
          [9, 5, 1, 6, 5, 7, 4, 3, 1, 7],
          [5, 2, 4, 7, 6, 8, 8, 6, 3, 9],
          [0, 6, 9, 5, 4, 9, 0, 4, 1, 4],
          [2, 8, 1, 2, 3, 6, 7, 2, 8, 5],
          [9, 8, 0, 7, 8, 0, 1, 3, 4, 0],
          [6, 2, 0, 4, 4, 1, 8, 1, 2, 9],
          [8, 4, 1, 7, 6, 5, 3, 1, 0, 6],
          [4, 2, 5, 0, 9, 0, 5, 4, 5, 7],
        ],
      },
      {
        id: 14,
        title: "The Captives of Kaag",
        code: "14tcok",
        serie: "Grand Master",
        disciplines: 5,
        isInitialized: false,
        randomNumberTable: [
          [8, 7, 6, 1, 3, 1, 6, 8, 6, 2],
          [0, 8, 6, 5, 0, 5, 8, 7, 4, 1],
          [9, 5, 1, 2, 5, 7, 4, 3, 1, 8],
          [5, 2, 4, 7, 6, 5, 8, 6, 0, 9],
          [0, 1, 9, 5, 4, 9, 0, 3, 1, 4],
          [5, 8, 1, 4, 3, 6, 7, 2, 8, 5],
          [9, 8, 6, 7, 8, 0, 2, 3, 4, 0],
          [6, 2, 0, 4, 4, 1, 8, 6, 2, 9],
          [8, 4, 8, 7, 6, 5, 2, 1, 0, 6],
          [4, 2, 5, 2, 9, 0, 5, 4, 8, 7],
        ],
      },
      {
        id: 15,
        title: "The Darke Crusade",
        code: "15tdc",
        serie: "Grand Master",
        disciplines: 6,
        isInitialized: false,
        randomNumberTable: [
          [8, 7, 6, 1, 3, 5, 6, 8, 6, 2],
          [0, 8, 3, 5, 0, 5, 8, 7, 4, 1],
          [9, 5, 1, 2, 5, 7, 4, 6, 1, 8],
          [5, 8, 4, 7, 6, 5, 8, 6, 0, 9],
          [0, 1, 9, 4, 2, 9, 0, 3, 1, 4],
          [5, 8, 1, 4, 3, 2, 7, 0, 8, 5],
          [1, 8, 6, 7, 8, 0, 2, 3, 5, 0],
          [6, 2, 0, 3, 4, 9, 8, 6, 2, 9],
          [2, 4, 8, 7, 6, 5, 2, 1, 0, 6],
          [4, 6, 5, 2, 9, 0, 1, 4, 8, 7],
        ],
      },
      {
        id: 16,
        title: "The Legacy of Vashna",
        code: "16tlov",
        serie: "Grand Master",
        disciplines: 7,
        isInitialized: false,
        randomNumberTable: [
          [8, 4, 6, 1, 0, 5, 6, 8, 3, 2],
          [0, 6, 3, 6, 0, 5, 8, 7, 4, 9],
          [7, 5, 6, 2, 5, 8, 4, 8, 1, 6],
          [5, 3, 4, 7, 6, 5, 8, 5, 0, 9],
          [0, 1, 9, 6, 2, 9, 8, 3, 1, 8],
          [2, 7, 1, 4, 1, 2, 7, 4, 8, 5],
          [1, 0, 6, 7, 8, 0, 2, 3, 1, 0],
          [6, 8, 0, 2, 4, 9, 5, 6, 2, 9],
          [5, 4, 8, 7, 8, 5, 2, 7, 0, 8],
          [1, 6, 3, 2, 9, 4, 1, 4, 5, 7],
        ],
      },
      {
        id: 17,
        title: "The Deathlord of Ixia",
        code: "17tdoi",
        serie: "Grand Master",
        disciplines: 8,
        isInitialized: false,
        randomNumberTable: [
          [8, 4, 3, 1, 6, 5, 6, 4, 3, 2],
          [0, 6, 3, 1, 7, 5, 8, 7, 4, 7],
          [7, 8, 6, 4, 5, 0, 4, 9, 1, 6],
          [9, 3, 6, 7, 6, 2, 8, 5, 0, 1],
          [0, 8, 9, 4, 2, 9, 0, 3, 1, 8],
          [2, 9, 1, 4, 8, 2, 7, 5, 8, 5],
          [1, 4, 6, 7, 5, 1, 2, 6, 1, 0],
          [2, 8, 0, 2, 8, 9, 5, 8, 2, 5],
          [5, 0, 8, 7, 6, 5, 4, 7, 0, 8],
          [8, 6, 3, 6, 9, 4, 1, 2, 5, 0],
        ],
      },
      {
        id: 18,
        title: "Dawn of the Dragons",
        code: "18dotd",
        serie: "Grand Master",
        disciplines: 9,
        isInitialized: false,
        randomNumberTable: [
          [5, 4, 3, 1, 6, 5, 3, 4, 3, 1],
          [0, 8, 6, 1, 7, 4, 8, 0, 6, 7],
          [7, 8, 6, 4, 5, 0, 4, 9, 1, 4],
          [9, 3, 8, 6, 1, 2, 8, 1, 0, 1],
          [8, 7, 9, 4, 2, 6, 0, 2, 9, 0],
          [2, 9, 5, 7, 8, 5, 7, 5, 8, 5],
          [9, 4, 6, 0, 5, 1, 2, 6, 3, 7],
          [2, 8, 6, 2, 8, 2, 5, 8, 2, 5],
          [3, 0, 9, 8, 6, 5, 4, 7, 1, 8],
          [8, 6, 0, 6, 7, 4, 1, 2, 5, 0],
        ],
      },
      {
        id: 19,
        title: "Wolf's Bane",
        code: "19wb",
        serie: "Grand Master",
        disciplines: 10,
        isInitialized: false,
        randomNumberTable: [
          [8, 5, 3, 1, 6, 2, 9, 7, 3, 1],
          [0, 3, 6, 1, 7, 4, 8, 0, 6, 5],
          [7, 8, 6, 4, 5, 0, 4, 2, 1, 4],
          [4, 3, 7, 6, 1, 5, 8, 1, 0, 1],
          [8, 7, 9, 4, 2, 6, 0, 3, 9, 0],
          [2, 9, 4, 7, 8, 0, 7, 5, 8, 6],
          [9, 3, 1, 0, 5, 8, 2, 6, 9, 7],
          [7, 4, 6, 2, 8, 5, 9, 8, 2, 5],
          [5, 0, 2, 8, 2, 5, 4, 6, 1, 8],
          [8, 6, 2, 6, 5, 4, 1, 8, 5, 0],
        ],
      },
      {
        id: 20,
        title: "The Curse of Naar",
        code: "20tcon",
        serie: "Grand Master",
        disciplines: 11,
        isInitialized: false,
        randomNumberTable: [
          [3, 5, 3, 1, 6, 2, 9, 7, 8, 1],
          [0, 3, 0, 1, 7, 4, 8, 1, 6, 5],
          [7, 8, 2, 4, 5, 0, 4, 6, 1, 4],
          [4, 3, 7, 6, 1, 5, 8, 1, 5, 1],
          [4, 7, 9, 4, 2, 6, 0, 3, 9, 0],
          [2, 9, 4, 7, 8, 0, 7, 5, 0, 6],
          [9, 3, 6, 0, 5, 8, 2, 6, 9, 7],
          [7, 4, 6, 2, 8, 5, 9, 1, 2, 5],
          [5, 0, 4, 8, 2, 5, 4, 6, 1, 8],
          [8, 7, 2, 6, 5, 4, 1, 8, 5, 0],
        ],
      },
    ] as Book[],
  }),

  // Define actions to mutate the state
  actions: {
    // Initialize the app and load saved data
    async initialize() {
      const storage = createStorage({
        name: "kai-master",
        storeName: "app",
      });

      // Wait for app storage to initialize
      await storage.waitForInit();

      // If we have a current book, wait for its storage to initialize
      if (this.book?.code) {
        const bookStorage = getBookStorage(this.book.code);
        await bookStorage.waitForInit();

        // Reload book data after initialization
        const savedBook = bookStorage.getItem("bookData");
        if (savedBook) {
          this.book = savedBook;
        }
      }

      // Setup the watcher after initialization
      this.$subscribe(() => {
        this.saveBook();
      });
    },

    // Fetch book data and initialize the current book
    async fetchBook() {
      const _book = this.books.find(
        (book) => book.code === this.book.code
      ) as Book;

      let book = {} as Book;
      book.id = _book.id;
      book.title = _book.title;
      book.code = _book.code;
      book.serie = _book.serie;
      book.disciplines = _book.disciplines;
      book.randomNumberTable = _book.randomNumberTable;
      book.data = await fetchBookdata(book.code);

      // Initialize action chart with default values
      book.actionChart = {
        combatSkill: 0,
        maxCombatSkill: 0,
        endurance: 0,
        maxEndurance: 0,
        beltPouch: 0,
        meals: 0,
        kaiDisciplines: {
          kaiDiscipline1: "",
          kaiDiscipline2: "",
          kaiDiscipline3: "",
          kaiDiscipline4: "",
          kaiDiscipline5: "",
          kaiDiscipline6: "",
          kaiDiscipline7: "",
          kaiDiscipline8: "",
          kaiDiscipline9: "",
          kaiDiscipline10: "",
          kaiDiscipline11: "",
          kaiDiscipline12: "",
        },
        weapons: {
          weapon1: "",
          weapon2: "",
        },
        backpackItems: {
          backpackItem1: "",
          backpackItem2: "",
          backpackItem3: "",
          backpackItem4: "",
          backpackItem5: "",
          backpackItem6: "",
          backpackItem7: "",
          backpackItem8: "",
        },
        specialItems: {
          specialItem1: "",
          specialItem2: "",
          specialItem3: "",
          specialItem4: "",
          specialItem5: "",
          specialItem6: "",
          specialItem7: "",
          specialItem8: "",
          specialItem9: "",
          specialItem10: "",
          specialItem11: "",
          specialItem12: "",
        },
        notes: "",
      } as ActionChart;

      // Initialize combat data with default values
      book.combat = {
        name: "",
        inProgress: false,
        isEvading: false,
        loneWolfCombatSkill: 0,
        enemyCombatSkill: 0,
        combatRatio: 0,
        boundedCombatRatio: 0,
        steps: [] as Step[],
      } as Combat;

      book.history = [] as SectionHistory[];
      book.isInitialized = true;
      this.book = book;
      this.saveBook();
    },

    // Load a book by its code
    async loadBook(code: string) {
      await this.saveBook();

      const bookStorage = getBookStorage(code);
      await bookStorage.waitForInit();
      const savedBook = bookStorage.getItem("bookData");

      if (savedBook) {
        this.book = savedBook;
      } else {
        this.book = this.books.find((book) => book.code === code) as Book;
      }
    },

    // Save the current book
    async saveBook() {
      const bookStorage = getBookStorage(this.book.code);
      bookStorage.setItem("bookData", this.book);
    },

    // Handle Action Chart mutations
    increaseCombatSkill(number: number) {
      if (!this.book.isStarted) {
        this.book.actionChart.combatSkill += number;
        this.book.actionChart.maxCombatSkill =
          this.book.actionChart.combatSkill;
      } else {
        this.book.actionChart.combatSkill =
          this.book.actionChart.combatSkill + number;
      }
    },

    decreaseCombatSkill(number: number) {
      this.book.actionChart.combatSkill = Math.max(
        0,
        this.book.actionChart.combatSkill - number
      );
      if (!this.book.isStarted) {
        this.book.actionChart.maxCombatSkill =
          this.book.actionChart.combatSkill;
      }
    },

    increaseEndurance(number: number) {
      if (!this.book.isStarted) {
        this.book.actionChart.endurance += number;
        this.book.actionChart.maxEndurance = this.book.actionChart.endurance;
      } else {
        this.book.actionChart.endurance =
          this.book.actionChart.endurance + number;
      }
    },

    decreaseEndurance(number: number) {
      this.book.actionChart.endurance = Math.max(
        0,
        this.book.actionChart.endurance - number
      );
      if (!this.book.isStarted) {
        this.book.actionChart.maxEndurance = this.book.actionChart.endurance;
      }
    },

    increaseBeltPouch(number: number) {
      this.book.actionChart.beltPouch = Math.min(
        50,
        this.book.actionChart.beltPouch + number
      );
    },

    decreaseBeltPouch(number: number) {
      this.book.actionChart.beltPouch = Math.max(
        0,
        this.book.actionChart.beltPouch - number
      );
    },

    increaseMeals(number: number) {
      this.book.actionChart.meals += number;
    },

    decreaseMeals(number: number) {
      this.book.actionChart.meals = Math.max(
        0,
        this.book.actionChart.meals - number
      );
    },

    // Handle combat steps
    handleCombatStep(randomNumber: number) {
      if (!this.book.combat) return;

      const { boundedCombatRatio, steps } = this.book.combat;
      const lastStep = steps[steps.length - 1];
      const result = getResult(randomNumber, boundedCombatRatio);

      // Create a new combat step
      const newStep: Step = {
        id: steps.length,
        loneWolfEndurance: computeNewEndurance(
          lastStep.loneWolfEndurance,
          result.lonewolfLoss
        ),
        enemyEndurance: this.book.combat.isEvading
          ? lastStep.enemyEndurance
          : computeNewEndurance(lastStep.enemyEndurance, result.enemyLoss),
        randomNumber,
      };

      this.book.combat.steps.push(newStep);
      this.book.actionChart.endurance = newStep.loneWolfEndurance;

      // Check if combat has ended
      if (
        newStep.loneWolfEndurance === 0 ||
        newStep.enemyEndurance === 0 ||
        this.book.combat.isEvading
      ) {
        this.book.combat.inProgress = false;
      }
    },

    // Add a new entry to the navigation history
    addHistory(name: string, path: string) {
      const id = this.book.history.length;
      const lastEntry = this.book.history[this.book.history.length - 1];
      const timestamp = new Date().toISOString();

      if (lastEntry?.path !== path) {
        this.book.history.push({ id, name, path, timestamp });
      }
    },
  },

  // Enable state persistence
  persist: {
    storage: createStorage({
      name: "kai-master",
      storeName: "app",
    }),
    pick: ["isLicenseAccepted", "downloadInProgress", "navigation"],
  },
});
