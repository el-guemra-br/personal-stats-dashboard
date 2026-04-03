export function CardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={`card-skeleton-${index}`}
          className="h-32 animate-pulse rounded-2xl border border-white/10 bg-linear-to-r from-slate-900/60 via-slate-700/20 to-slate-900/60"
        />
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div
      className="h-72 animate-pulse rounded-2xl border border-white/10 bg-linear-to-r from-slate-900/60 via-slate-700/20 to-slate-900/60"
      aria-hidden="true"
    />
  );
}
