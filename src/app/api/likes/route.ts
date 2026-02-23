import { NextRequest, NextResponse } from "next/server";
import { getLikeCounts } from "@/lib/likes-store";

// GET /api/likes?ids=r001,r002,r003 — batch fetch like counts
export async function GET(req: NextRequest) {
  const idsParam = req.nextUrl.searchParams.get("ids");
  if (!idsParam) {
    return NextResponse.json({ counts: {} });
  }

  const ids = idsParam.split(",").slice(0, 50);
  const counts = getLikeCounts(ids);
  return NextResponse.json({ counts });
}
