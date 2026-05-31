"use client";

import { motion } from "framer-motion";

type ProbabilityChartProps = {
  probabilities: Record<string, number>;
};

export function ProbabilityChart({ probabilities }: ProbabilityChartProps) {
  // Veriyi yüzdeye çevirip büyükten küçüğe sıralıyoruz
  const data = Object.entries(probabilities)
    .map(([label, probability]) => ({
      label,
      probability: Number((probability * 100).toFixed(2)),
    }))
    .sort((a, b) => b.probability - a.probability);

  const topClass = data[0];

  return (
    <div className="rounded-[2rem] border border-border/60 bg-background p-6 md:p-8 flex flex-col">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-foreground">
            Class Probabilities
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Prediction probabilities returned by the Random Forest model.
          </p>
        </div>

        {topClass ? (
          <div className="w-fit rounded-full border border-border/40 bg-muted/10 px-3 py-1 text-xs font-medium text-muted-foreground">
            Top: <span className="text-foreground">{topClass.label}</span>
          </div>
        ) : null}
      </div>

      <div className="flex-1 rounded-[1.5rem] border border-border/40 bg-muted/5 p-6">
        <div className="flex flex-col gap-5">
          {data.map((item, index) => (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{item.label}</span>
                <span className="font-mono text-muted-foreground">{item.probability.toFixed(2)}%</span>
              </div>
              
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/30">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.probability}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                  className="h-full bg-foreground rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}