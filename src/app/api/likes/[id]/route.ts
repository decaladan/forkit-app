import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { SEED_RECIPES } from "@/data/seed-recipes";

const validIds = new Set(SEED_RECIPES.map((r) => r.id));

// GET /api/likes/[id] — returns { count: number }
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!validIds.has(id)) {
    return NextResponse.json({ count: 0 }, { status: 404 });
  }

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ count: 0 });
  }

  const count = (await redis.get<number>(`likes:${id}`)) ?? 0;
  return NextResponse.json({ count });
}

// POST /api/likes/[id] — increments and returns { count: number }
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!validIds.has(id)) {
    return NextResponse.json({ error: "Invalid recipe" }, { status: 404 });
  }

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ count: 0 });
  }

  const count = await redis.incr(`likes:${id}`);
  return NextResponse.json({ count });
}
