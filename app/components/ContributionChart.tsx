"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TrendPoint } from "@/app/lib/types";

interface ContributionChartProps {
  data: TrendPoint[];
}

export default function ContributionChart({ data }: ContributionChartProps) {
  if (data.length === 0) {
    return <p className="text-sm text-slate-400">No contribution history available.</p>;
  }

  return (
    <div className="h-72 w-full" role="img" aria-label="Contributions trend over 90 days">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 16, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.2)" strokeDasharray="4 4" />
          <XAxis dataKey="label" stroke="#94a3b8" tick={{ fontSize: 11 }} minTickGap={20} />
          <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(2, 6, 23, 0.95)",
              border: "1px solid rgba(148, 163, 184, 0.4)",
              borderRadius: "12px",
              color: "#e2e8f0",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#22d3ee"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, fill: "#67e8f9" }}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
