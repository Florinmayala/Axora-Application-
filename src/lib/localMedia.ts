/** Local media repository. Resolve writes only once their transaction commits. */
const DB_NAME = 'axora-media';
const STORE_NAME = 'files';

function transact<T>(mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const opening = indexedDB.open(DB_NAME, 1);
    opening.onupgradeneeded = () => opening.result.createObjectStore(STORE_NAME);
    opening.onerror = () => reject(opening.error);
    opening.onblocked = () => reject(new Error('Le stockage est occupé. Fermez les autres onglets puis réessayez.'));
    opening.onsuccess = () => {
      const db = opening.result;
      const transaction = db.transaction(STORE_NAME, mode);
      const request = operation(transaction.objectStore(STORE_NAME));
      transaction.oncomplete = () => { db.close(); resolve(request.result); };
      transaction.onabort = transaction.onerror = () => { db.close(); reject(transaction.error || request.error || new Error('Stockage indisponible')); };
    };
  });
}

export async function saveLocalMedia(id: string, blob: Blob): Promise<void> {
  await transact('readwrite', store => store.put(blob, id));
}

export async function readLocalMedia(id: string): Promise<Blob | null> {
  const result = await transact('readonly', store => store.get(id));
  return result instanceof Blob ? result : null;
}
