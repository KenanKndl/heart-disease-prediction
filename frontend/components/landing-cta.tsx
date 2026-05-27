import Link from "next/link";
import { ArrowRight, BrainCircuit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function LandingCta() {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardContent className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10">
        <div className="max-w-2xl">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted">
            <BrainCircuit className="h-5 w-5" />
          </div>

          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Ready to test the model?
          </h2>

          <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
            Open the prediction workspace, load a random ECG heartbeat sample,
            run the classifier and inspect the prediction probabilities,
            confidence score and extracted features.
          </p>
        </div>

        <Button asChild size="lg" className="w-full rounded-xl md:w-auto">
          <Link href="/predict">
            Open Prediction Demo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}