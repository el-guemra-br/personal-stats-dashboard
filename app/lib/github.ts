import { subDays } from "date-fns";
import { getOrSetCache } from "./cache";
import { getEnv } from "./env";
import { safeDivide } from "./formatting";
import type {
  ActivityItem,
  ContributionDay,
  GitHubStats,
  LanguageSlice,
  RepoSummary,
  TrendPoint,
} from "./types";

const GITHUB_REST_BASE = "https://api.github.com";
const GITHUB_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3776AB",
  Go: "#00ADD8",
  Rust: "#DEA584",
  Java: "#ED8B00",
  "C#": "#9B4F96",
  HTML: "#E34F26",
  CSS: "#1572B6",
  Shell: "#89E051",
};

interface GitHubUserResponse {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  followers: number;
  public_repos: number;
}

interface GitHubRepoResponse {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  created_at: string;
  pushed_at: string;
  size: number;
  fork: boolean;
}

interface GitHubEventResponse {
  id: string;
  type: string;
  repo: { name: string; url: string };
  created_at: string;
  payload: {
    action?: string;
    ref_type?: string;
  };
}

function getHeaders(): HeadersInit {
  const env = getEnv();
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "User-Agent": "personal-stats-dashboard",
  };

  if (env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
  }

  return headers;
}

async function fetchGitHubRest<T>(path: string): Promise<T> {
  const response = await fetch(`${GITHUB_REST_BASE}${path}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`GitHub REST request failed (${response.status}) for ${path}`);
  }

  return (await response.json()) as T;
}

function computeStreak(days: ContributionDay[]): number {
  let streak = 0;
  for (let index = days.length - 1; index >= 0; index -= 1) {
    if (days[index].count <= 0) {
      break;
    }
    streak += 1;
  }
  return streak;
}

function mapLanguagesFromRepos(repos: GitHubRepoResponse[]): LanguageSlice[] {
  const languageTotals = new Map<string, number>();

  for (const repo of repos) {
    if (repo.fork || !repo.language) {
      continue;
    }

    languageTotals.set(repo.language, (languageTotals.get(repo.language) ?? 0) + 1);
  }

  return Array.from(languageTotals.entries())
    .map(([name, value]) => ({
      name,
      value,
      color: LANGUAGE_COLORS[name] ?? "#8B949E",
    }))
    .sort((left, right) => right.value - left.value)
    .slice(0, 8);
}

function mapTopRepositories(repos: GitHubRepoResponse[]): RepoSummary[] {
  return repos
    .filter((repo) => !repo.fork)
    .sort((left, right) => right.stargazers_count - left.stargazers_count)
    .slice(0, 5)
    .map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      description: repo.description,
      stars: repo.stargazers_count,
      language: repo.language ?? "Unknown",
      createdAt: repo.created_at,
      pushedAt: repo.pushed_at,
      sizeKb: repo.size,
    }));
}

function mapRepositoryGrowth(repos: GitHubRepoResponse[]): TrendPoint[] {
  const byMonth = new Map<string, number>();

  for (const repo of repos) {
    if (repo.fork) {
      continue;
    }

    const key = repo.created_at.slice(0, 7);
    byMonth.set(key, (byMonth.get(key) ?? 0) + 1);
  }

  return Array.from(byMonth.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .slice(-12)
    .map(([label, value]) => ({ label, value }));
}

function mapRecentActivity(events: GitHubEventResponse[]): ActivityItem[] {
  return events.slice(0, 10).map((event) => {
    const action = event.payload.action ?? event.payload.ref_type ?? event.type.replace(/Event$/, "");

    return {
      id: event.id,
      type: event.type,
      repo: event.repo.name,
      action,
      createdAt: event.created_at,
      url: event.repo.url.replace("api.github.com/repos", "github.com"),
    };
  });
}

function sumContributions(days: ContributionDay[], sinceDate: Date): number {
  return days.filter((day) => new Date(day.date) >= sinceDate).reduce((sum, day) => sum + day.count, 0);
}

function buildContributionTrend(days: ContributionDay[], maxDays: number): TrendPoint[] {
  return days.slice(-maxDays).map((day) => ({
    label: day.date.slice(5),
    value: day.count,
  }));
}

function buildContributionDaysFromEvents(events: GitHubEventResponse[], windowDays: number): ContributionDay[] {
  const counts = new Map<string, number>();
  const cutoff = subDays(new Date(), windowDays);

  for (const event of events) {
    const eventDate = new Date(event.created_at);
    if (eventDate < cutoff) {
      continue;
    }

    const dateKey = event.created_at.slice(0, 10);
    counts.set(dateKey, (counts.get(dateKey) ?? 0) + 1);
  }

  const days: ContributionDay[] = [];
  for (let offset = windowDays - 1; offset >= 0; offset -= 1) {
    const date = subDays(new Date(), offset).toISOString().slice(0, 10);
    days.push({ date, count: counts.get(date) ?? 0 });
  }

  return days;
}

export async function getGitHubStats(): Promise<GitHubStats> {
  return getGitHubStatsForUser();
}

function resolveGitHubUsername(usernameOverride?: string): string {
  const env = getEnv();
  const candidate = usernameOverride?.trim() || env.GITHUB_USERNAME;

  if (!candidate) {
    throw new Error("GitHub username is required. Provide ?username=your-handle or set GITHUB_USERNAME.");
  }

  return candidate;
}

export async function getGitHubStatsForUser(usernameOverride?: string): Promise<GitHubStats> {
  const username = resolveGitHubUsername(usernameOverride);

  const { data, outdated, lastUpdated } = await getOrSetCache(
    `github:${username}`,
    GITHUB_CACHE_TTL_MS,
    async () => {
      const [user, repos, events] = await Promise.all([
        fetchGitHubRest<GitHubUserResponse>(`/users/${username}`),
        fetchGitHubRest<GitHubRepoResponse[]>(
          `/users/${username}/repos?per_page=100&sort=updated&type=owner`,
        ),
        fetchGitHubRest<GitHubEventResponse[]>(`/users/${username}/events/public?per_page=30`),
      ]);

      const filteredRepos = repos.filter((repo) => !repo.fork);
      const contributionDays = buildContributionDaysFromEvents(events, 90);
      const languages = mapLanguagesFromRepos(filteredRepos);

      return {
        username: user.login,
        displayName: user.name ?? user.login,
        avatarUrl: user.avatar_url,
        profileUrl: user.html_url,
        bio: user.bio,
        followers: user.followers,
        publicRepos: filteredRepos.length,
        totalContributionsLast30Days: sumContributions(contributionDays, subDays(new Date(), 30)),
        totalContributionsLast90Days: sumContributions(contributionDays, subDays(new Date(), 90)),
        contributionStreak: computeStreak(contributionDays),
        languages,
        topRepositories: mapTopRepositories(filteredRepos),
        recentActivity: mapRecentActivity(events),
        contributionTrend30Days: buildContributionTrend(contributionDays.slice(-30), 30),
        contributionTrend90Days: buildContributionTrend(contributionDays, 90),
        repositoryGrowth: mapRepositoryGrowth(filteredRepos),
        outdated: false,
        lastUpdated: new Date().toISOString(),
      } satisfies GitHubStats;
    },
  );

  const mostRecentRepo = data.topRepositories[0];
  if (!mostRecentRepo && data.publicRepos > 0) {
    const averageRepoStars = safeDivide(data.topRepositories.reduce((sum, repo) => sum + repo.stars, 0), data.topRepositories.length);
    if (Number.isNaN(averageRepoStars)) {
      console.debug("Average stars could not be computed.");
    }
  }

  return {
    ...data,
    outdated,
    lastUpdated,
  };
}
