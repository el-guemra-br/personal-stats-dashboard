import { ChartsSection } from "@/app/components/ChartsSection";
import { Header } from "@/app/components/Header";
import { RecentActivity } from "@/app/components/RecentActivity";
import { SharePanel } from "@/app/components/SharePanel";
import { StatsCard } from "@/app/components/StatsCard";
import { getDashboardData } from "@/app/lib/dashboard";
import { getEnv } from "@/app/lib/env";
import { formatCompactNumber, formatFullNumber, levelFromValue } from "@/app/lib/formatting";

export const revalidate = 3600;

type HomeProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function contributionMoM(trend90Days: Array<{ value: number }>): { current: number; previous: number; delta: number } {
  const current30 = trend90Days.slice(-30).reduce((sum, day) => sum + day.value, 0);
  const previous30 = trend90Days.slice(-60, -30).reduce((sum, day) => sum + day.value, 0);
  return {
    current: current30,
    previous: previous30,
    delta: current30 - previous30,
  };
}

export default async function Home({ searchParams }: HomeProps) {
  let env: ReturnType<typeof getEnv>;
  let data: Awaited<ReturnType<typeof getDashboardData>>;
  const resolvedSearchParams = await searchParams;
  const usernameFromQuery = resolvedSearchParams.username;
  const selectedUsername = Array.isArray(usernameFromQuery)
    ? usernameFromQuery[0]
    : usernameFromQuery;

  if (!selectedUsername?.trim()) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 text-center text-slate-200">
        <h1 className="text-3xl font-semibold">Choose a GitHub username</h1>
        <p className="mt-3 text-slate-400">
          This dashboard is multi-user. Enter any public GitHub handle to load that profile.
        </p>
        <form method="GET" className="mt-6 flex w-full max-w-lg flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-left">
          <label htmlFor="username" className="text-sm text-slate-300">
            GitHub username
          </label>
          <input
            id="username"
            name="username"
            placeholder="octocat"
            className="rounded-xl border border-white/15 bg-slate-950/70 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-400"
            required
          />
          <button
            type="submit"
            className="rounded-xl border border-sky-300/50 bg-sky-500/10 px-4 py-2 text-sm text-sky-100 hover:border-sky-300"
          >
            Load Dashboard
          </button>
        </form>
      </main>
    );
  }

  try {
    env = getEnv();
    data = await getDashboardData(selectedUsername);
  } catch (error) {
    const envError = error instanceof Error ? error.message.includes("GitHub username is required") : false;

    if (envError) {
      return (
        <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 text-center text-slate-200">
          <h1 className="text-3xl font-semibold">Choose a GitHub username</h1>
          <p className="mt-3 text-slate-400">
            This dashboard can be used by anyone. Enter any public GitHub handle to view that profile analytics.
          </p>
          <form method="GET" className="mt-6 flex w-full max-w-lg flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-left">
            <label htmlFor="username" className="text-sm text-slate-300">
              GitHub username
            </label>
            <input
              id="username"
              name="username"
              placeholder="octocat"
              className="rounded-xl border border-white/15 bg-slate-950/70 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-400"
              required
            />
            <button
              type="submit"
              className="rounded-xl border border-sky-300/50 bg-sky-500/10 px-4 py-2 text-sm text-sky-100 hover:border-sky-300"
            >
              Load Dashboard
            </button>
          </form>
          <p className="mt-4 text-xs text-slate-500">
            Tip: you can also open directly with <strong>?username=your-handle</strong>
          </p>
        </main>
      );
    }

    if (process.env.NODE_ENV !== "production") {
      console.error("Dashboard render failure", error);
    }
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 text-center text-slate-200">
        <h1 className="text-2xl font-semibold">Dashboard unavailable</h1>
        <p className="mt-3 text-slate-400">
          Check API availability and username validity.
        </p>
        <p className="mt-2 text-xs text-slate-500">{error instanceof Error ? error.message : "Unknown error"}</p>
        <p className="mt-2 text-sm text-slate-400">
          External status pages: <a className="text-sky-300 underline" href="https://www.githubstatus.com/">GitHub</a> and{" "}
          <a className="text-sky-300 underline" href="https://status.wakatime.com/">WakaTime</a>
        </p>
        <div className="mt-6 w-full max-w-xl rounded-xl border border-white/10 bg-slate-900/60 p-4 text-left text-sm text-slate-300">
          <p className="font-medium text-slate-100">Quick setup</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Create .env.local from .env.example.</li>
            <li>Set optional API keys.</li>
            <li>Restart dev server.</li>
          </ol>
        </div>
      </main>
    );
  }

  const comparison = contributionMoM(data.github.contributionTrend90Days);
  const stale = data.github.outdated || data.wakatime.outdated || data.social.outdated;
  const developerGitHubUrl = env.DEVELOPER_GITHUB_USERNAME ? `https://github.com/${env.DEVELOPER_GITHUB_USERNAME}` : undefined;
  const developerInstagramUrl = env.DEVELOPER_INSTAGRAM_USERNAME
    ? `https://www.instagram.com/${env.DEVELOPER_INSTAGRAM_USERNAME}`
    : undefined;
  const wakatimeProfileUrl = env.WAKATIME_USERNAME ? `https://wakatime.com/@${env.WAKATIME_USERNAME}` : undefined;

  return (
    <main id="dashboard-root" className="relative flex-1 overflow-hidden px-4 py-8 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-28 top-10 h-72 w-72 rounded-full bg-sky-500/25 blur-3xl" />
        <div className="absolute right-0 top-36 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.2),rgba(2,6,23,0.95)_55%)]" />
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <Header
          brandName={env.DASHBOARD_NAME}
          bio={env.DASHBOARD_BIO}
          location={env.DASHBOARD_LOCATION}
          githubUrl={data.github.profileUrl}
          developerGitHubUrl={developerGitHubUrl}
          developerInstagramUrl={developerInstagramUrl}
          wakatimeProfileUrl={wakatimeProfileUrl}
          portfolioUrl={env.PORTFOLIO_URL}
          linkedinUrl={env.LINKEDIN_URL}
          avatarUrl={data.github.avatarUrl}
          updatedAt={data.generatedAt}
          stale={stale}
        />

        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300 backdrop-blur-xl">
          <form method="GET" className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label htmlFor="username" className="shrink-0 text-slate-300">
              View another profile:
            </label>
            <input
              id="username"
              name="username"
              defaultValue={data.github.username}
              className="min-w-0 flex-1 rounded-xl border border-white/15 bg-slate-950/70 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-400"
              placeholder="octocat"
            />
            <button
              type="submit"
              className="rounded-xl border border-sky-300/50 bg-sky-500/10 px-4 py-2 text-sky-100 hover:border-sky-300"
            >
              Load
            </button>
          </form>
        </section>

        <section aria-labelledby="key-metrics-heading" className="space-y-4">
          <h2 id="key-metrics-heading" className="text-xl font-semibold text-slate-100 sm:text-2xl">
            Key Metrics
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatsCard
              label="Repositories"
              value={formatCompactNumber(data.github.publicRepos)}
              hint="Public non-fork projects"
              level={levelFromValue(data.github.publicRepos, 30, 12)}
            />
            <StatsCard
              label="Followers"
              value={formatCompactNumber(data.social.totalFollowers)}
              hint={`GitHub ${formatCompactNumber(data.social.githubFollowers)} total`}
              level={levelFromValue(data.social.totalFollowers, 1000, 250)}
            />
            <StatsCard
              label="Contributions (30d)"
              value={formatCompactNumber(data.github.totalContributionsLast30Days)}
              hint="Public contribution volume"
              level={levelFromValue(data.github.totalContributionsLast30Days, 60, 20)}
            />
            <StatsCard
              label="Coding Hours (Week)"
              value={data.wakatime.active ? `${data.wakatime.totalHoursWeek}h` : "N/A"}
              hint={data.wakatime.active ? "From WakaTime" : "Connect WakaTime API"}
              level={levelFromValue(data.wakatime.totalHoursWeek, 20, 8)}
            />
            <StatsCard
              label="Most Used Language"
              value={data.portfolio.mostUsedLanguage}
              hint="Across public repositories"
              level="high"
            />
            <StatsCard
              label="Coding Streak"
              value={`${Math.max(data.github.contributionStreak, data.wakatime.codingStreak)} days`}
              hint="Consecutive active days"
              level={levelFromValue(Math.max(data.github.contributionStreak, data.wakatime.codingStreak), 10, 4)}
            />
          </div>
        </section>

        <section aria-labelledby="charts-heading" className="space-y-4">
          <h2 id="charts-heading" className="text-xl font-semibold text-slate-100 sm:text-2xl">
            Growth Trends
          </h2>
          <ChartsSection
            languages={data.github.languages}
            contributionTrend90Days={data.github.contributionTrend90Days}
            dailyHoursLastWeek={data.wakatime.dailyHoursLastWeek}
            wakatimeActive={data.wakatime.active}
            wakatimeUsername={env.WAKATIME_USERNAME}
            repositoryGrowth={data.github.repositoryGrowth}
          />
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <RecentActivity items={data.github.recentActivity} />

          <article className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-slate-100">Portfolio Metrics</h2>
            <dl className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between rounded-xl bg-slate-950/45 px-3 py-2">
                <dt>Total Projects</dt>
                <dd>{formatFullNumber(data.portfolio.totalProjects)}</dd>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-950/45 px-3 py-2">
                <dt>Estimated Total LOC</dt>
                <dd>{formatCompactNumber(data.portfolio.estimatedTotalLinesOfCode)}</dd>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-950/45 px-3 py-2">
                <dt>Average Repo Size</dt>
                <dd>{formatCompactNumber(data.portfolio.averageRepositorySizeKb)} KB</dd>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-950/45 px-3 py-2">
                <dt>Contribution MoM</dt>
                <dd className={comparison.delta >= 0 ? "text-emerald-300" : "text-rose-300"}>
                  {comparison.delta >= 0 ? "+" : ""}
                  {comparison.delta}
                </dd>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-950/45 px-3 py-2">
                <dt>Most Productive Day</dt>
                <dd>{data.wakatime.mostProductiveDay}</dd>
              </div>
            </dl>
          </article>
        </section>

        <SharePanel />
      </div>
    </main>
  );
}
