/**
 * Persistent like counter store using a GitHub Gist as storage.
 * No external services — uses your existing GitHub account.
 *
 * - In-memory cache for fast reads (no API call per request)
 * - On cold start: fetches likes from the Gist
 * - On each like: updates memory + writes back to the Gist
 */

const GIST_ID = process.env.GIST_ID || "";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const FILE_NAME = "likes.json";

let cache: Record<string, number> | null = null;
let gistSha: string | null = null; // needed for updates

/** Fetch likes from the Gist (cold start only) */
async function loadFromGist(): Promise<Record<string, number>> {
  if (cache) return cache;

  if (!GIST_ID || !GITHUB_TOKEN) {
    cache = {};
    return cache;
  }

  try {
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      cache = {};
      return cache;
    }

    const gist = await res.json();
    const file = gist.files?.[FILE_NAME];
    cache = file ? JSON.parse(file.content) : {};
  } catch {
    cache = {};
  }

  return cache!;
}

/** Write likes back to the Gist (fire and forget) */
function saveToGist() {
  if (!GIST_ID || !GITHUB_TOKEN || !cache) return;

  const body = JSON.stringify({
    files: {
      [FILE_NAME]: { content: JSON.stringify(cache) },
    },
  });

  // Non-blocking write — don't await
  fetch(`https://api.github.com/gists/${GIST_ID}`, {
    method: "PATCH",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body,
  }).catch(() => {
    // Gist write failed — likes still in memory
  });
}

export async function getLikeCount(recipeId: string): Promise<number> {
  const store = await loadFromGist();
  return store[recipeId] ?? 0;
}

export async function incrementLike(recipeId: string): Promise<number> {
  const store = await loadFromGist();
  store[recipeId] = (store[recipeId] ?? 0) + 1;
  saveToGist();
  return store[recipeId];
}

export async function getLikeCounts(
  ids: string[]
): Promise<Record<string, number>> {
  const store = await loadFromGist();
  const result: Record<string, number> = {};
  for (const id of ids) {
    result[id] = store[id] ?? 0;
  }
  return result;
}
