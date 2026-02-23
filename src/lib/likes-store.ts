import fs from "fs";

/**
 * Simple like counter store — no external services needed.
 *
 * Uses an in-memory cache backed by a /tmp file for persistence
 * within the same Vercel execution environment. The function stays
 * warm for minutes to hours during active traffic, so likes persist
 * throughout normal usage sessions.
 */

const LIKES_FILE = "/tmp/forkit-likes.json";

let cache: Record<string, number> | null = null;

function load(): Record<string, number> {
  if (cache) return cache;
  try {
    cache = JSON.parse(fs.readFileSync(LIKES_FILE, "utf8"));
  } catch {
    cache = {};
  }
  return cache!;
}

function save() {
  try {
    fs.writeFileSync(LIKES_FILE, JSON.stringify(cache));
  } catch {
    // /tmp write failed — in-memory still works
  }
}

export function getLikeCount(recipeId: string): number {
  return load()[recipeId] ?? 0;
}

export function incrementLike(recipeId: string): number {
  const store = load();
  store[recipeId] = (store[recipeId] ?? 0) + 1;
  save();
  return store[recipeId];
}

export function getLikeCounts(ids: string[]): Record<string, number> {
  const store = load();
  const result: Record<string, number> = {};
  for (const id of ids) {
    result[id] = store[id] ?? 0;
  }
  return result;
}
