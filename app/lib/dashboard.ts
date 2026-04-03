import { getGitHubStatsForUser } from "./github";
import { safeDivide } from "./formatting";
import { getSocialStats } from "./social";
import type { DashboardData, PortfolioMetrics } from "./types";
import { getWakaTimeStats } from "./wakatime";

function computePortfolioMetrics(data: DashboardData["github"]): PortfolioMetrics {
  const totalProjects = data.publicRepos;
  const totalSizeKb = data.topRepositories.reduce((sum, repo) => sum + repo.sizeKb, 0);
  const estimatedTotalLinesOfCode = Math.round(data.languages.reduce((sum, language) => sum + language.value, 0) / 35);
  const mostUsedLanguage = data.languages[0]?.name ?? "Unknown";

  return {
    totalProjects,
    estimatedTotalLinesOfCode,
    mostUsedLanguage,
    averageRepositorySizeKb: Number(safeDivide(totalSizeKb, data.topRepositories.length || 1).toFixed(1)),
  };
}

export async function getDashboardData(username?: string): Promise<DashboardData> {
  const github = await getGitHubStatsForUser(username);
  const [wakatime, social] = await Promise.all([
    getWakaTimeStats(),
    getSocialStats(github.followers, github.username),
  ]);

  const dashboard = {
    github,
    wakatime,
    social,
    portfolio: computePortfolioMetrics(github),
    generatedAt: new Date().toISOString(),
  } satisfies DashboardData;

  return dashboard;
}
