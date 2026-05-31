import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function LandingCta() {
  return (
    <div className="rounded-[2rem] border border-foreground bg-foreground p-8 text-background md:p-10">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-background/60">
            Prediction Demo
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-background md:text-5xl">
            Test the pipeline with a real ECG sample.
          </h2>

          <p className="mt-4 max-w-xl text-base leading-7 text-background/70">
            Open the prediction workspace, load a random heartbeat signal and
            inspect the model output through the signal chart, probability
            scores and extracted features.
          </p>
        </div>

        <Button
          asChild
          size="lg"
          variant="secondary"
          className="h-14 w-full rounded-2xl px-8 text-base font-medium md:w-auto"
        >
          <Link href="/predict">
            Open Prediction Demo
            <ArrowRight className="ml-2 h-5 w-5" strokeWidth={1.6} />
          </Link>
        </Button>
      </div>
    </div>
  );
}