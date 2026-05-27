"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type EcgChartProps = {
  signal: number[];
};

export function EcgChart({ signal }: EcgChartProps) {
  const data = signal.map((value, index) => ({
    point: index,
    value,
  }));

  return (
    <div className="h-[320px] w-full rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-slate-900">ECG Signal</h3>
        <p className="text-sm text-slate-500">
          187-point heartbeat segment from the MIT-BIH dataset.
        </p>
      </div>

      <ResponsiveContainer width="100%" height="82%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="point"
            tick={{ fontSize: 12 }}
            label={{
              value: "Signal Point",
              position: "insideBottom",
              offset: -5,
            }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            strokeWidth={2}
            dot={false}
            name="Amplitude"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}