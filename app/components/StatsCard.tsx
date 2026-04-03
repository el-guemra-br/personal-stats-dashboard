import { cn } from "@/app/lib/utils";
import { levelClasses } from "@/app/lib/formatting";
import type { ActivityLevel } from "@/app/lib/types";

interface StatsCardProps {
  label: string;
  value: string;
  hint?: string;
  level?: ActivityLevel;
}

export function StatsCard({ label, value, hint, level = "moderate" }: StatsCardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-white/15 bg-white/5 p-4 shadow-[0_12px_30px_rgba(5,9,20,0.35)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1",
        levelClasses(level),
      )}
      aria-label={`${label}: ${value}`}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-slate-300">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-100">{value}</p>
      {hint ? <p className="mt-2 text-sm text-slate-400">{hint}</p> : null}
    </article>
  );
}
