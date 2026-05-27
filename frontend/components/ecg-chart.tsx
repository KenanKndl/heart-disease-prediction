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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type EcgChartProps = {
  signal: number[];
};

export function EcgChart({ signal }: EcgChartProps) {
  const data = signal.map((value, index) => ({
    point: index,
    value,
  }));

  return (
    <Card className="border-border/70 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">ECG Signal</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          187-point heartbeat segment from the MIT-BIH dataset.
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
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
                stroke="currentColor"
                strokeWidth={2}
                dot={false}
                name="Amplitude"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
