"use client";

import dynamic from "next/dynamic";
import type { LanguageSlice, TrendPoint } from "@/app/lib/types";
import { ChartSkeleton } from "./LoadingSkeletons";

const ContributionChart = dynamic(() => import("@/app/components/ContributionChart"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});
const LanguagesChart = dynamic(() => import("@/app/components/LanguagesChart"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});
const CodingHoursChart = dynamic(() => import("@/app/components/CodingHoursChart"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});
const RepositoryGrowthChart = dynamic(() => import("@/app/components/RepositoryGrowthChart"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

interface ChartsSectionProps {
  languages: LanguageSlice[];
  contributionTrend90Days: TrendPoint[];
  dailyHoursLastWeek: TrendPoint[];
  wakatimeActive: boolean;
  wakatimeUsername?: string;
  repositoryGrowth: TrendPoint[];
}

export function ChartsSection({
  languages,
  contributionTrend90Days,
  dailyHoursLastWeek,
  wakatimeActive,
  wakatimeUsername,
  repositoryGrowth,
}: ChartsSectionProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <article className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
        <h3 className="text-sm uppercase tracking-[0.2em] text-slate-300">Languages Breakdown</h3>
        <div className="mt-3">
          <LanguagesChart data={languages} />
        </div>
      </article>

      <article className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
        <h3 className="text-sm uppercase tracking-[0.2em] text-slate-300">Contributions (90d)</h3>
        <div className="mt-3">
          <ContributionChart data={contributionTrend90Days} />
        </div>
      </article>

      <article className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
        <h3 className="text-sm uppercase tracking-[0.2em] text-slate-300">Coding Hours (Last Week)</h3>
        {wakatimeUsername ? <p className="mt-1 text-xs text-slate-400">WakaTime @{wakatimeUsername}</p> : null}
        <div className="mt-3">
          <CodingHoursChart data={dailyHoursLastWeek} active={wakatimeActive} />
        </div>
      </article>

      <article className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
        <h3 className="text-sm uppercase tracking-[0.2em] text-slate-300">Repository Growth</h3>
        <div className="mt-3">
          <RepositoryGrowthChart data={repositoryGrowth} />
        </div>
      </article>
    </div>
  );
}
