import localforage from "localforage";

const storage = localforage.createInstance({
  name: "kai-master",
  storeName: "books",
});

// Writes are chained so they reach IndexedDB in the order they were issued.
let lastWrite: Promise<unknown> = Promise.resolve();

export const bookStorage = {
  async getItem<T>(key: string): Promise<T | null> {
    return (await storage.getItem<T>(key)) ?? null;
  },

  setItem(key: string, value: unknown): Promise<void> {
    // Strip reactivity and functions before handing the value to IndexedDB.
    const plain = JSON.parse(JSON.stringify(value));
    lastWrite = lastWrite
      .then(() => storage.setItem(key, plain))
      .catch((error) => console.error(`Storage error while saving ${key}:`, error));
    return lastWrite as Promise<void>;
  },

  removeItem(key: string): Promise<void> {
    lastWrite = lastWrite
      .then(() => storage.removeItem(key))
      .catch((error) => console.error(`Storage error while removing ${key}:`, error));
    return lastWrite as Promise<void>;
  },

  /** Resolves once every write issued so far has been committed. */
  flush(): Promise<void> {
    return lastWrite.then(() => undefined);
  },
};

/** Key of the small, frequently written game state of a book. */
export const stateKey = (code: string) => `book-${code}`;

/** Key of the large, write-once parsed content of a book. */
export const contentKey = (code: string) => `content-${code}`;
