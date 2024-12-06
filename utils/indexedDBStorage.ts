class IndexedDBStorage {
  private db: IDBDatabase | null = null;
  private cache: { [key: string]: any } = {};
  private dbName = "kai-master";
  private storeName = "kai-master";
  private dbReady: Promise<void>;

  constructor() {
    this.dbReady = this.initDB();
  }

  // Initialize the database connection and check if we need to create/upgrade the store
  private initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName);

      request.onsuccess = () => {
        const db = request.result;
        const currentVersion = db.version;
        db.close();

        // Upgrade database if store doesn't exist
        if (!db.objectStoreNames.contains(this.storeName)) {
          this.createDatabase(currentVersion + 1)
            .then(resolve)
            .catch(reject);
        } else {
          this.createDatabase(currentVersion).then(resolve).catch(reject);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  // Create or open the database with specified version
  private createDatabase(version: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, version);

      // Create object store during database upgrade
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: "key" });
        }
      };

      request.onerror = () => reject(request.error);

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        this.db.onerror = (event) => {
          console.error("Database error:", event);
        };

        // Initialize cache and resolve
        this.loadCache()
          .then(resolve)
          .catch(() => resolve()); // Continue even if cache load fails
      };
    });
  }

  // Load all data from IndexedDB into memory cache
  private async loadCache(): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction([this.storeName], "readonly");
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();

        request.onsuccess = () => {
          const entries = request.result || [];
          entries.forEach((entry: any) => {
            this.cache[entry.key] = entry.value;
          });
          resolve();
        };

        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  //  Synchronously get item from cache. Required for Pinia persistence plugin
  getItem(key: string): string | null {
    return this.cache[key] || null;
  }

  // Set item in cache and asynchronously update IndexedDB. Required for Pinia persistence plugin
  setItem(key: string, value: string): void {
    this.cache[key] = value;

    this.dbReady.then(() => {
      if (!this.db) return;

      try {
        const transaction = this.db.transaction([this.storeName], "readwrite");
        const store = transaction.objectStore(this.storeName);
        store.put({ key, value });
      } catch (error) {
        console.error("Storage error:", error);
      }
    });
  }

  //  Remove item from cache and asynchronously remove from IndexedDB. Required for Pinia persistence plugin
  removeItem(key: string): void {
    delete this.cache[key];

    this.dbReady.then(() => {
      if (!this.db) return;

      try {
        const transaction = this.db.transaction([this.storeName], "readwrite");
        const store = transaction.objectStore(this.storeName);
        store.delete(key);
      } catch (error) {
        console.error("Storage error:", error);
      }
    });
  }
}

// Export a singleton instance for use with Pinia
export const indexedDBStorage = new IndexedDBStorage();
