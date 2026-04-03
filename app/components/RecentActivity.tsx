import { formatDateTime, formatRelativeTime } from "@/app/lib/formatting";
import type { ActivityItem } from "@/app/lib/types";

interface RecentActivityProps {
  items: ActivityItem[];
}

export function RecentActivity({ items }: RecentActivityProps) {
  if (items.length === 0) {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <h2 className="text-xl font-semibold text-slate-100">Recent Activity</h2>
        <p className="mt-3 text-sm text-slate-400">No public activity yet.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h2 className="text-xl font-semibold text-slate-100">Recent Activity</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col gap-1 focus-visible:outline-2 focus-visible:outline-sky-400"
            >
              <span className="text-sm font-medium text-slate-100">
                {item.type} in <span className="text-sky-300">{item.repo}</span>
              </span>
              <span className="text-sm text-slate-400">{item.action}</span>
              <time className="text-xs text-slate-500" title={formatDateTime(item.createdAt)}>
                {formatRelativeTime(item.createdAt)}
              </time>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
