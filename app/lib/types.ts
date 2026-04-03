export type ActivityLevel = "high" | "moderate" | "low";

export interface TrendPoint {
  label: string;
  value: number;
}

export interface LanguageSlice {
  name: string;
  value: number;
  color: string;
}

export interface RepoSummary {
  name: string;
  url: string;
  description: string | null;
  stars: number;
  language: string;
  createdAt: string;
  pushedAt: string;
  sizeKb: number;
}

export interface ActivityItem {
  id: string;
  type: string;
  repo: string;
  action: string;
  createdAt: string;
  url: string;
}

export interface ContributionDay {
  date: string;
  count: number;
}

export interface GitHubStats {
  username: string;
  displayName: string;
  avatarUrl: string;
  profileUrl: string;
  bio: string | null;
  followers: number;
  publicRepos: number;
  totalContributionsLast30Days: number;
  totalContributionsLast90Days: number;
  contributionStreak: number;
  languages: LanguageSlice[];
  topRepositories: RepoSummary[];
  recentActivity: ActivityItem[];
  contributionTrend30Days: TrendPoint[];
  contributionTrend90Days: TrendPoint[];
  repositoryGrowth: TrendPoint[];
  outdated: boolean;
  lastUpdated: string;
}

export interface WakaTimeStats {
  active: boolean;
  totalHoursWeek: number;
  totalHoursMonth: number;
  codingStreak: number;
  mostProductiveDay: string;
  languages: LanguageSlice[];
  dailyHoursLastWeek: TrendPoint[];
  outdated: boolean;
  lastUpdated: string;
}

export interface SocialStats {
  githubFollowers: number;
  twitterFollowers: number | null;
  linkedinFollowers: number | null;
  totalFollowers: number;
  followersTrend: TrendPoint[];
  outdated: boolean;
  lastUpdated: string;
}

export interface PortfolioMetrics {
  totalProjects: number;
  estimatedTotalLinesOfCode: number;
  mostUsedLanguage: string;
  averageRepositorySizeKb: number;
}

export interface DashboardData {
  github: GitHubStats;
  wakatime: WakaTimeStats;
  social: SocialStats;
  portfolio: PortfolioMetrics;
  generatedAt: string;
}
