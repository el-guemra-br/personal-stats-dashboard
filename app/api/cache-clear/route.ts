import { NextRequest, NextResponse } from "next/server";
import { clearAllCaches } from "@/app/lib/cache";
import { getEnv } from "@/app/lib/env";

export async function POST(request: NextRequest) {
  const env = getEnv();
  const token = request.headers.get("x-refresh-token");

  if (env.CACHE_CLEAR_TOKEN && token !== env.CACHE_CLEAR_TOKEN) {
    return NextResponse.json({ error: "Unauthorized cache clear attempt." }, { status: 401 });
  }

  const cleared = clearAllCaches();
  return NextResponse.json(
    {
      success: true,
      message: "Cache cleared successfully.",
      clearedKeys: cleared,
      clearedAt: new Date().toISOString(),
    },
    { status: 200 },
  );
}
