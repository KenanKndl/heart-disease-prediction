import { Activity, ChartNoAxesCombined, Filter, Trees } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  {
    title: "ECG Signal Input",
    description: "A 187-point heartbeat segment is loaded from the MIT-BIH test set.",
    icon: Activity,
  },
  {
    title: "Feature Extraction",
    description: "Statistical, energy-based and peak-based ECG features are extracted.",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Feature Selection",
    description: "SelectKBest chooses the most discriminative 60 features from 205.",
    icon: Filter,
  },
  {
    title: "Classification",
    description: "The selected features are classified with a Random Forest model.",
    icon: Trees,
  },
];

export function PipelineSummary() {
  return (
    <Card className="border-border/70 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Methodology Pipeline</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          The project follows a complete machine learning workflow from ECG
          signal input to final arrhythmia prediction.
        </p>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="rounded-2xl border border-border/70 bg-muted/30 p-5"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>

                  <span className="text-sm font-semibold text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}