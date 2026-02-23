/**
 * Persistent like counter store using a GitHub Gist as storage.
 * No external services — uses your existing GitHub account.
 *
 * - In-memory cache for fast reads (no API call per request)
 * - On cold start: fetches likes from the Gist
 * - On each like: updates memory + writes merged data to the Gist
 */

const GIST_ID = process.env.GIST_ID || "";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const FILE_NAME = "likes.json";

let cache: Record<string, number> | null = null;

const gistHeaders: Record<string, string> = {
  Authorization: `token ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
  "Content-Type": "application/json",
};

/** Fetch likes from the Gist */
async function fetchGist(): Promise<Record<string, number>> {
  if (!GIST_ID || !GITHUB_TOKEN) return {};

  try {
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: gistHeaders,
      cache: "no-store",
    });
    if (!res.ok) return {};
    const gist = await res.json();
    const file = gist.files?.[FILE_NAME];
    return file ? JSON.parse(file.content) : {};
  } catch {
    return {};
  }
}

/** Load cache from Gist on cold start */
async function ensureCache(): Promise<Record<string, number>> {
  if (cache) return cache;
  cache = await fetchGist();
  return cache;
}

/** Merge local cache with remote, take max of each count, write back */
async function saveToGist(): Promise<void> {
  if (!GIST_ID || !GITHUB_TOKEN || !cache) return;

  try {
    // Read latest remote state
    const remote = await fetchGist();

    // Merge: keep the higher count for each recipe
    const merged = { ...remote };
    for (const [id, count] of Object.entries(cache)) {
      merged[id] = Math.max(merged[id] ?? 0, count);
    }

    // Update local cache with merged data
    cache = merged;

    // Write back
    await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: "PATCH",
      headers: gistHeaders,
      body: JSON.stringify({
        files: { [FILE_NAME]: { content: JSON.stringify(merged) } },
      }),
    });
  } catch {
    // Gist write failed — likes still in memory
  }
}

export async function getLikeCount(recipeId: string): Promise<number> {
  const store = await ensureCache();
  return store[recipeId] ?? 0;
}

export async function incrementLike(recipeId: string): Promise<number> {
  const store = await ensureCache();
  store[recipeId] = (store[recipeId] ?? 0) + 1;
  await saveToGist();
  return store[recipeId];
}

export async function getLikeCounts(
  ids: string[]
): Promise<Record<string, number>> {
  const store = await ensureCache();
  const result: Record<string, number> = {};
  for (const id of ids) {
    result[id] = store[id] ?? 0;
  }
  return result;
}
