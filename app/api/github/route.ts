import { NextResponse } from "next/server";
import { getGitHubStatsForUser } from "@/app/lib/github";

export const revalidate = 86400;

export async function GET(request: Request) {
  try {
    const username = new URL(request.url).searchParams.get("username") ?? undefined;
    const github = await getGitHubStatsForUser(username);
    return NextResponse.json(github, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected GitHub error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
