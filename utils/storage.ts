import localforage from "localforage";

// Singleton maps to store instances and their caches across the app
const storageInstances = new Map<string, LocalForage>();
const caches = new Map<string, Map<string, any>>();
const initPromises = new Map<string, Promise<void>>();

// Loads all data from indexedDB into memory cache for synchronous access
async function initializeStorage(
  key: string,
  storage: LocalForage
): Promise<void> {
  const cache = new Map<string, any>();
  caches.set(key, cache);

  try {
    await storage.iterate((value, key) => {
      cache.set(key, value);
    });
  } catch (error) {
    console.error("Storage initialization error:", error);
  }
}

// Gets or creates a LocalForage instance with in-memory cache
function getStorage(config: StorageConfig): LocalForage {
  const key = getStorageKey(config);

  if (!storageInstances.has(key)) {
    const storage = localforage.createInstance({
      name: config.name,
      storeName: config.storeName,
    });
    storageInstances.set(key, storage);

    const initPromise = initializeStorage(key, storage);
    initPromises.set(key, initPromise);
  }

  return storageInstances.get(key)!;
}

// Creates a unique key for each storage instance
function getStorageKey(config: StorageConfig): string {
  return `${config.name}:${config.storeName}`;
}

// Creates a storage interface with sync cache access and async persistence
export const createStorage = (config: StorageConfig) => {
  const storage = getStorage(config);
  const key = getStorageKey(config);
  const initPromise = initPromises.get(key)!;

  let isInitialized = false;
  initPromise.then(() => {
    isInitialized = true;
  });

  return {
    // Gets item from cache, returns null if not initialized or not found
    getItem: (key: string) => {
      const cache = caches.get(getStorageKey(config));
      if (!isInitialized || !cache) {
        return null;
      }
      return cache.get(key) ?? null;
    },

    // Updates cache immediately and persists to storage async
    setItem: (key: string, value: any) => {
      const cache = caches.get(getStorageKey(config));
      if (!cache) return;

      const safeValue = JSON.parse(JSON.stringify(value));
      cache.set(key, safeValue);

      storage.setItem(key, safeValue).catch((error) => {
        console.error("Storage error:", error);
        cache.set(key, null);
      });
    },

    // Removes item from cache and storage
    removeItem: (key: string) => {
      const cache = caches.get(getStorageKey(config));
      if (!cache) return;

      cache.delete(key);
      storage.removeItem(key).catch(console.error);
    },

    // Waits for cache to be populated from storage
    async waitForInit() {
      await initPromise;
    },
  };
};

// Creates a dedicated storage instance for a specific book
export function getBookStorage(code: string) {
  return createStorage({
    name: "kai-master",
    storeName: `book-${code}`,
  });
}
