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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProbabilityChartProps = {
  probabilities: Record<string, number>;
};

export function ProbabilityChart({ probabilities }: ProbabilityChartProps) {
  const data = Object.entries(probabilities).map(([label, probability]) => ({
    label,
    probability: Number((probability * 100).toFixed(2)),
  }));

  return (
    <Card className="border-border/70 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Class Probabilities</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          Prediction probabilities returned by the Random Forest model.
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
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
              <Bar dataKey="probability" fill="currentColor" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
