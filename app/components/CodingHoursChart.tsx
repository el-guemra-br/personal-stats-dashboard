"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TrendPoint } from "@/app/lib/types";

interface CodingHoursChartProps {
  data: TrendPoint[];
  active: boolean;
}

export default function CodingHoursChart({ data, active }: CodingHoursChartProps) {
  if (!active) {
    return <p className="text-sm text-slate-400">Connect WakaTime to unlock coding hours analytics.</p>;
  }

  if (data.length === 0) {
    return <p className="text-sm text-slate-400">No coding sessions in the selected period.</p>;
  }

  return (
    <div className="h-72 w-full" role="img" aria-label="Coding hours by day">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 16, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.2)" strokeDasharray="4 4" />
          <XAxis dataKey="label" stroke="#94a3b8" tick={{ fontSize: 11 }} />
          <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(2, 6, 23, 0.95)",
              border: "1px solid rgba(148, 163, 184, 0.4)",
              borderRadius: "12px",
              color: "#e2e8f0",
            }}
          />
          <Bar dataKey="value" fill="#60a5fa" radius={[8, 8, 0, 0]} animationDuration={800} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
