"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TrendPoint } from "@/app/lib/types";

interface RepositoryGrowthChartProps {
  data: TrendPoint[];
}

export default function RepositoryGrowthChart({ data }: RepositoryGrowthChartProps) {
  if (data.length === 0) {
    return <p className="text-sm text-slate-400">No repository growth data available.</p>;
  }

  return (
    <div className="h-72 w-full" role="img" aria-label="Repository growth by month">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 16, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="repoGrowth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#34d399" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.2)" strokeDasharray="4 4" />
          <XAxis dataKey="label" stroke="#94a3b8" tick={{ fontSize: 11 }} minTickGap={16} />
          <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(2, 6, 23, 0.95)",
              border: "1px solid rgba(148, 163, 184, 0.4)",
              borderRadius: "12px",
              color: "#e2e8f0",
            }}
          />
          <Area type="monotone" dataKey="value" stroke="#34d399" fill="url(#repoGrowth)" strokeWidth={2} animationDuration={900} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
