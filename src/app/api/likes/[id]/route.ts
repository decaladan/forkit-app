import { NextRequest, NextResponse } from "next/server";
import { getLikeCount, incrementLike } from "@/lib/likes-store";
import { SEED_RECIPES } from "@/data/seed-recipes";

const validIds = new Set(SEED_RECIPES.map((r) => r.id));

// GET /api/likes/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!validIds.has(id)) {
    return NextResponse.json({ count: 0 }, { status: 404 });
  }

  return NextResponse.json({ count: getLikeCount(id) });
}

// POST /api/likes/[id]
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!validIds.has(id)) {
    return NextResponse.json({ error: "Invalid recipe" }, { status: 404 });
  }

  const count = incrementLike(id);
  return NextResponse.json({ count });
}
