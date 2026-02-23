import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

// GET /api/likes?ids=r001,r002,r003 — batch fetch like counts
export async function GET(req: NextRequest) {
  const idsParam = req.nextUrl.searchParams.get("ids");
  if (!idsParam) {
    return NextResponse.json({ counts: {} });
  }

  const ids = idsParam.split(",").slice(0, 50); // max 50 at a time
  const redis = getRedis();

  if (!redis) {
    const counts: Record<string, number> = {};
    for (const id of ids) counts[id] = 0;
    return NextResponse.json({ counts });
  }

  const pipeline = redis.pipeline();
  for (const id of ids) {
    pipeline.get(`likes:${id}`);
  }
  const results = await pipeline.exec();

  const counts: Record<string, number> = {};
  ids.forEach((id, i) => {
    counts[id] = (results[i] as number) ?? 0;
  });

  return NextResponse.json({ counts });
}
