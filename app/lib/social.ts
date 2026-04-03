import { getOrSetCache } from "./cache";
import { getEnv } from "./env";
import type { SocialStats, TrendPoint } from "./types";

const SOCIAL_CACHE_TTL_MS = 48 * 60 * 60 * 1000;

interface TwitterUserResponse {
  data?: {
    id: string;
    username: string;
    public_metrics?: {
      followers_count: number;
    };
  };
}

async function fetchTwitterFollowers(username: string, bearerToken: string): Promise<number | null> {
  const response = await fetch(
    `https://api.twitter.com/2/users/by/username/${encodeURIComponent(username)}?user.fields=public_metrics`,
    {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    },
  );

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as TwitterUserResponse;
  return payload.data?.public_metrics?.followers_count ?? null;
}

function estimateTrend(totalFollowers: number): TrendPoint[] {
  // Public social APIs do not provide historical snapshots, so the MVP shows
  // an estimated baseline trend until a persistent datastore is added.
  const factors = [0.86, 0.89, 0.92, 0.95, 0.98, 1];
  const monthLabels = ["M-5", "M-4", "M-3", "M-2", "M-1", "Now"];

  return monthLabels.map((label, index) => ({
    label,
    value: Math.round(totalFollowers * factors[index]),
  }));
}

export async function getSocialStats(githubFollowers: number, githubUsername: string): Promise<SocialStats> {
  const env = getEnv();

  const { data, outdated, lastUpdated } = await getOrSetCache(
    `social:${githubUsername}`,
    SOCIAL_CACHE_TTL_MS,
    async () => {
      const twitterFollowers =
        env.TWITTER_BEARER_TOKEN && env.TWITTER_USERNAME
          ? await fetchTwitterFollowers(env.TWITTER_USERNAME, env.TWITTER_BEARER_TOKEN)
          : null;

      const linkedinFollowers = env.LINKEDIN_FOLLOWERS ?? null;
      const totalFollowers = githubFollowers + (twitterFollowers ?? 0) + (linkedinFollowers ?? 0);

      return {
        githubFollowers,
        twitterFollowers,
        linkedinFollowers,
        totalFollowers,
        followersTrend: estimateTrend(totalFollowers),
        outdated: false,
        lastUpdated: new Date().toISOString(),
      } satisfies SocialStats;
    },
  );

  return {
    ...data,
    outdated,
    lastUpdated,
  };
}
