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
    <div className="rounded-[2rem] border border-border/60 bg-background p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-foreground">
            ECG Signal
          </h3>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            187-point heartbeat segment loaded from the MIT-BIH test set.
          </p>
        </div>

        <div className="w-fit rounded-full border border-border/60 bg-muted/25 px-3 py-1 text-xs font-medium text-muted-foreground">
          {signal.length} signal points
        </div>
      </div>

      <div className="h-[360px] w-full rounded-[1.5rem] border border-border/60 bg-muted/15 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 18, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.35} />

            <XAxis
              dataKey="point"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              label={{
                value: "Signal Point",
                position: "insideBottom",
                offset: -6,
                fontSize: 12,
              }}
            />

            <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />

            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{
                borderRadius: "14px",
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--background))",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              }}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="currentColor"
              strokeWidth={2.5}
              dot={false}
              name="Amplitude"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}