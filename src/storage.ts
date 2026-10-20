import type { CipherText, VaultConfig } from "./crypto";

const DATABASE_NAME = "bcn-local-vault";
const STORE_NAME = "encrypted_records";
const DATABASE_VERSION = 1;

export interface StoredVault {
  config: VaultConfig;
  state: CipherText;
}

export async function vaultExists(): Promise<boolean> {
  return (await readRecord<VaultConfig>("config")) !== undefined;
}

export async function readVault(): Promise<StoredVault | null> {
  const [config, state] = await Promise.all([
    readRecord<VaultConfig>("config"),
    readRecord<CipherText>("state"),
  ]);
  if (!config && !state) return null;
  if (!config || !state) throw new Error("Le coffre local est incomplet.");
  return { config, state };
}

export async function writeVault(vault: StoredVault): Promise<void> {
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.put(vault.config, "config");
    store.put(vault.state, "state");
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("Échec de l’écriture locale."));
    transaction.onabort = () => reject(transaction.error ?? new Error("Écriture locale annulée."));
  });
  database.close();
}

async function readRecord<T>(key: string): Promise<T | undefined> {
  const database = await openDatabase();
  const value = await new Promise<T | undefined>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).get(key);
    request.onsuccess = () => resolve(request.result as T | undefined);
    request.onerror = () => reject(request.error ?? new Error("Lecture locale impossible."));
  });
  database.close();
  return value;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) database.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB indisponible."));
    request.onblocked = () => reject(new Error("La base locale est utilisée dans un autre onglet."));
  });
}

export async function requestPersistentStorage(): Promise<"granted" | "denied" | "unknown"> {
  if (!navigator.storage?.persist) return "unknown";
  try {
    return (await navigator.storage.persist()) ? "granted" : "denied";
  } catch {
    return "unknown";
  }
}
