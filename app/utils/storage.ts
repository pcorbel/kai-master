import localforage from "localforage";

// Single storage instance for book data
const storage = localforage.createInstance({
  name: "kai-master",
  storeName: "books",
});

// In-memory cache
const cache = new Map<string, any>();
let initPromise: Promise<void>;

// Initialize storage and load all data into memory
async function initializeStorage(): Promise<void> {
  if (!initPromise) {
    initPromise = storage.iterate((value, key) => {
      cache.set(key, value);
    });
  }
  return initPromise;
}

// Create storage interface
export const createStorage = () => {
  return {
    // Get item from cache
    getItem: (key: string) => {
      return cache.get(key) ?? null;
    },

    // Set item in cache and persist
    setItem: (key: string, value: any) => {
      const safeValue = JSON.parse(JSON.stringify(value));
      cache.set(key, safeValue);

      storage.setItem(key, safeValue).catch((error) => {
        console.error("Storage error:", error);
        cache.set(key, null);
      });
    },

    // Remove item from cache and storage
    removeItem: (key: string) => {
      cache.delete(key);
      storage.removeItem(key).catch(console.error);
    },

    // Wait for initialization
    waitForInit: async () => {
      await initializeStorage();
    },
  };
};

// Helper function to get book data key
export function getBookKey(code: string): string {
  return `book-${code}`;
}
