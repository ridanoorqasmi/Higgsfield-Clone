import type { GenerationResult } from "@/lib/generation";
import { parseGenerations } from "./parse";
import type { Generation } from "./types";

const DB_NAME = "higgsfield-clone";
const DB_VERSION = 1;
const STORE_NAME = "generations";
const LEGACY_STORAGE_KEY = "higgsfield-clone.generations";
const MIGRATION_FLAG_KEY = "higgsfield-clone.generations.migrated-to-idb";

export class AssetsPersistenceError extends Error {
  constructor(message = "Could not save to Assets. Local storage is unavailable.") {
    super(message);
    this.name = "AssetsPersistenceError";
  }
}

function canUseIndexedDb(): boolean {
  return typeof window !== "undefined" && typeof window.indexedDB !== "undefined";
}

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function createGenerationId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `gen-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function generationFromResult(result: GenerationResult): Generation {
  return {
    id: createGenerationId(),
    type: "image",
    prompt: result.prompt,
    model: result.request.model,
    createdAt: new Date().toISOString(),
    settings: {
      aspectRatio: result.request.aspectRatio,
      quality: result.request.quality,
      resolution: result.request.resolution,
      mode: result.request.mode,
    },
    outputs: result.images.map((image) => ({
      id: image.id,
      url: image.url,
    })),
  };
}

function sortNewestFirst(generations: Generation[]): Generation[] {
  return [...generations].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new AssetsPersistenceError("IndexedDB request failed."));
  });
}

function openDatabase(): Promise<IDBDatabase> {
  if (!canUseIndexedDb()) {
    return Promise.reject(new AssetsPersistenceError());
  }

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new AssetsPersistenceError("Could not open Assets database."));
  });
}

function readLegacyLocalStorageGenerations(): Generation[] {
  if (!canUseLocalStorage()) return [];
  try {
    const raw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return [];
    return parseGenerations(JSON.parse(raw));
  } catch {
    return [];
  }
}

function clearLegacyLocalStorage(): void {
  if (!canUseLocalStorage()) return;
  try {
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    window.localStorage.setItem(MIGRATION_FLAG_KEY, "1");
  } catch {
    // Migration data is already in IndexedDB; legacy cleanup is best-effort.
  }
}

function hasCompletedLegacyMigration(): boolean {
  if (!canUseLocalStorage()) return false;
  try {
    return window.localStorage.getItem(MIGRATION_FLAG_KEY) === "1";
  } catch {
    return false;
  }
}

async function readAllFromDb(db: IDBDatabase): Promise<Generation[]> {
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const rows = await requestToPromise(store.getAll());
  return sortNewestFirst(parseGenerations(rows));
}

async function putAllIntoDb(db: IDBDatabase, generations: Generation[]): Promise<void> {
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  await Promise.all(generations.map((generation) => requestToPromise(store.put(generation))));

  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () =>
      reject(tx.error ?? new AssetsPersistenceError("Could not write Assets database."));
    tx.onabort = () =>
      reject(tx.error ?? new AssetsPersistenceError("Assets write was aborted."));
  });
}

/**
 * One-time migration: copy valid localStorage generations into IndexedDB,
 * then clear the legacy key. Never deletes IndexedDB history to free space.
 */
async function migrateLegacyIfNeeded(db: IDBDatabase): Promise<void> {
  if (hasCompletedLegacyMigration()) return;

  const legacy = readLegacyLocalStorageGenerations();
  if (legacy.length === 0) {
    clearLegacyLocalStorage();
    return;
  }

  const existing = await readAllFromDb(db);
  const byId = new Map<string, Generation>();
  for (const item of existing) byId.set(item.id, item);
  for (const item of legacy) {
    if (!byId.has(item.id)) byId.set(item.id, item);
  }

  await putAllIntoDb(db, sortNewestFirst([...byId.values()]));
  clearLegacyLocalStorage();
}

export async function readGenerations(): Promise<Generation[]> {
  if (!canUseIndexedDb()) return [];

  try {
    const db = await openDatabase();
    try {
      await migrateLegacyIfNeeded(db);
      return await readAllFromDb(db);
    } finally {
      db.close();
    }
  } catch {
    return [];
  }
}

export async function writeGenerations(generations: Generation[]): Promise<void> {
  if (!canUseIndexedDb()) {
    throw new AssetsPersistenceError();
  }

  const db = await openDatabase();
  try {
    await migrateLegacyIfNeeded(db);

    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    await requestToPromise(store.clear());
    await Promise.all(
      generations.map((generation) => requestToPromise(store.put(generation))),
    );

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () =>
        reject(tx.error ?? new AssetsPersistenceError("Could not save to Assets."));
      tx.onabort = () =>
        reject(tx.error ?? new AssetsPersistenceError("Assets write was aborted."));
    });
  } finally {
    db.close();
  }
}

export async function appendGeneration(generation: Generation): Promise<void> {
  if (!canUseIndexedDb()) {
    throw new AssetsPersistenceError();
  }

  const db = await openDatabase();
  try {
    await migrateLegacyIfNeeded(db);

    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    await requestToPromise(store.put(generation));

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () =>
        reject(tx.error ?? new AssetsPersistenceError("Could not save to Assets."));
      tx.onabort = () =>
        reject(tx.error ?? new AssetsPersistenceError("Assets write was aborted."));
    });
  } finally {
    db.close();
  }
}

export async function saveGenerationFromResult(
  result: GenerationResult,
): Promise<Generation> {
  const generation = generationFromResult(result);
  try {
    await appendGeneration(generation);
  } catch (error) {
    if (error instanceof AssetsPersistenceError) throw error;
    throw new AssetsPersistenceError(
      "Generated successfully, but could not save to Assets. Local storage is unavailable.",
    );
  }
  return generation;
}

/** Test helpers — merge legacy + existing without deleting history. */
export function mergeGenerationsForMigration(
  existing: Generation[],
  legacy: Generation[],
): Generation[] {
  const byId = new Map<string, Generation>();
  for (const item of existing) byId.set(item.id, item);
  for (const item of legacy) {
    if (!byId.has(item.id)) byId.set(item.id, item);
  }
  return sortNewestFirst([...byId.values()]);
}
