"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ProbabilityChartProps = {
  probabilities: Record<string, number>;
};

export function ProbabilityChart({ probabilities }: ProbabilityChartProps) {
  const data = Object.entries(probabilities).map(([label, probability]) => ({
    label,
    probability: Number((probability * 100).toFixed(2)),
  }));

  return (
    <div className="h-[320px] w-full rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-slate-900">
          Class Probabilities
        </h3>
        <p className="text-sm text-slate-500">
          Prediction probabilities returned by the Random Forest model.
        </p>
      </div>

      <ResponsiveContainer width="100%" height="82%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11 }}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={80}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            domain={[0, 100]}
            label={{
              value: "Probability (%)",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip formatter={(value) => [`${value}%`, "Probability"]} />
          <Bar dataKey="probability" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}