import { NextResponse } from "next/server";
import { getGitHubStatsForUser } from "@/app/lib/github";
import { getSocialStats } from "@/app/lib/social";

export const revalidate = 172800;

export async function GET(request: Request) {
  try {
    const username = new URL(request.url).searchParams.get("username") ?? undefined;
    const github = await getGitHubStatsForUser(username);
    const social = await getSocialStats(github.followers, github.username);
    return NextResponse.json(social, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected social stats error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
