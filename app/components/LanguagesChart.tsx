"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { LanguageSlice } from "@/app/lib/types";

interface LanguagesChartProps {
  data: LanguageSlice[];
}

export default function LanguagesChart({ data }: LanguagesChartProps) {
  if (data.length === 0) {
    return <p className="text-sm text-slate-400">No language data yet.</p>;
  }

  return (
    <div className="h-72 w-full" role="img" aria-label="Programming language distribution chart">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={92}
            innerRadius={50}
            paddingAngle={2}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(2, 6, 23, 0.95)",
              border: "1px solid rgba(148, 163, 184, 0.4)",
              borderRadius: "12px",
              color: "#e2e8f0",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
