import { Redis } from "@upstash/redis";

// Lazily create the Redis client — returns null if env vars aren't set
// (allows the app to work without Redis in dev)
let redis: Redis | null = null;

export function getRedis(): Redis | null {
  if (redis) return redis;

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) return null;

  redis = new Redis({ url, token });
  return redis;
}
