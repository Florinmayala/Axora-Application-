/**
 * Temporary front-end media store.
 *
 * IndexedDB keeps binary files out of localStorage and gives the messaging UI
 * the same asynchronous interface it will use with a future upload API.
 */
const DB_NAME = 'axora-media';
const STORE_NAME = 'files';

function openStore(mode: IDBTransactionMode): Promise<IDBObjectStore> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const transaction = request.result.transaction(STORE_NAME, mode);
      transaction.onerror = () => reject(transaction.error);
      resolve(transaction.objectStore(STORE_NAME));
    };
  });
}

export async function saveLocalMedia(id: string, blob: Blob): Promise<void> {
  const store = await openStore('readwrite');
  await new Promise<void>((resolve, reject) => {
    const request = store.put(blob, id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function readLocalMedia(id: string): Promise<Blob | null> {
  const store = await openStore('readonly');
  return new Promise((resolve, reject) => {
    const request = store.get(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result instanceof Blob ? request.result : null);
  });
}
