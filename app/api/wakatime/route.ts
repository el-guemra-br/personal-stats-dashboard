import { NextResponse } from "next/server";
import { getWakaTimeStats } from "@/app/lib/wakatime";

export const revalidate = 14400;

export async function GET() {
  try {
    const wakatime = await getWakaTimeStats();
    return NextResponse.json(wakatime, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected WakaTime error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
