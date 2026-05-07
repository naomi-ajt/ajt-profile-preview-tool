const DB_NAME = "ajt-catalogue-cache";
const STORE_NAME = "summaries";
const DB_VERSION = 1;
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_ENTRIES = 500;

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE_NAME, { keyPath: "id" });
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

// Returns { [id]: string[] } for all IDs that have a valid non-expired cache entry
export async function getCachedSummaries(ids) {
  if (!ids.length) return {};
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const now = Date.now();
  const results = {};
  await Promise.all(
    ids.map(
      (id) =>
        new Promise((resolve) => {
          const req = store.get(id);
          req.onsuccess = () => {
            const val = req.result;
            if (val && now - val.cachedAt < TTL_MS) results[id] = val.bullets;
            resolve();
          };
          req.onerror = () => resolve();
        })
    )
  );
  return results;
}

// Persists an array of { id, bullets } entries, then prunes expired and excess entries
export async function cacheSummaries(entries) {
  if (!entries.length) return;
  const db = await openDb();

  // Write new entries
  const writeTx = db.transaction(STORE_NAME, "readwrite");
  const writeStore = writeTx.objectStore(STORE_NAME);
  const now = Date.now();
  for (const { id, bullets } of entries) {
    writeStore.put({ id, bullets, cachedAt: now });
  }
  await new Promise((resolve, reject) => {
    writeTx.oncomplete = resolve;
    writeTx.onerror = (e) => reject(e.target.error);
  });

  // Prune expired entries and cap total size asynchronously — non-blocking
  pruneCache(db, now).catch(() => {});
}

async function pruneCache(db, now) {
  const readTx = db.transaction(STORE_NAME, "readonly");
  const readStore = readTx.objectStore(STORE_NAME);

  const all = await new Promise((resolve, reject) => {
    const req = readStore.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  const expired = all.filter((e) => now - e.cachedAt >= TTL_MS).map((e) => e.id);

  // If still over limit after removing expired, also remove oldest entries
  const remaining = all.filter((e) => now - e.cachedAt < TTL_MS);
  const excess = remaining.length > MAX_ENTRIES
    ? remaining.sort((a, b) => a.cachedAt - b.cachedAt).slice(0, remaining.length - MAX_ENTRIES).map((e) => e.id)
    : [];

  const toDelete = [...new Set([...expired, ...excess])];
  if (!toDelete.length) return;

  const deleteTx = db.transaction(STORE_NAME, "readwrite");
  const deleteStore = deleteTx.objectStore(STORE_NAME);
  for (const id of toDelete) deleteStore.delete(id);
  await new Promise((resolve, reject) => {
    deleteTx.oncomplete = resolve;
    deleteTx.onerror = (e) => reject(e.target.error);
  });
}
