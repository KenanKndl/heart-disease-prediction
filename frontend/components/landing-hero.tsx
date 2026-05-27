import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  Database,
  FlaskConical,
  Server,
  Signal,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type LandingHeroProps = {
  apiStatusText: string;
  isConnected: boolean;
};

export function LandingHero({ apiStatusText, isConnected }: LandingHeroProps) {
  return (
    <section className="border-b border-border bg-background px-6">
      <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-[1320px] items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              <Activity className="mr-1.5 h-3.5 w-3.5" />
              ECG Classification
            </Badge>

            <Badge variant="outline" className="rounded-full px-3 py-1">
              MIT-BIH Dataset
            </Badge>

            <Badge variant="outline" className="rounded-full px-3 py-1">
              Random Forest
            </Badge>
          </div>

          <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Detect ECG arrhythmia patterns with machine learning.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            A clean machine learning demo that transforms raw ECG heartbeat
            signals into selected features and predicts arrhythmia classes using
            a trained Random Forest classifier.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-xl">
              <Link href="/predict">
                Start Prediction
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="rounded-xl">
              <Link href="#methodology">View Methodology</Link>
            </Button>
          </div>

          <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
            <HeroStat label="Input" value="187 points" />
            <HeroStat label="Features" value="205 total" />
            <HeroStat label="Selected" value="60 best" />
          </div>
        </div>

        <div className="grid gap-4">
          <Card className="border-border bg-card shadow-sm">
            <CardContent className="p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    ECG Signal Preview
                  </p>
                  <h2 className="mt-1 text-2xl font-bold tracking-tight">
                    Heartbeat segment
                  </h2>
                </div>

                <div className="rounded-2xl border border-border bg-muted p-3 text-foreground">
                  <Signal className="h-5 w-5" />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="flex h-40 items-center">
                  <svg
                    viewBox="0 0 600 160"
                    className="h-full w-full"
                    role="img"
                    aria-label="ECG waveform illustration"
                  >
                    <polyline
                      points="0,92 40,92 55,88 68,94 82,92 100,92 116,92 128,36 140,126 154,92 178,92 196,88 218,92 245,92 270,92 286,42 300,122 314,92 342,92 365,89 388,92 420,92 450,92 466,34 480,128 494,92 524,92 548,88 570,92 600,92"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <InfoTile
                  icon={Database}
                  label="Dataset"
                  value="MIT-BIH heartbeat samples"
                />
                <InfoTile
                  icon={BrainCircuit}
                  label="Model"
                  value="Random Forest classifier"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-border bg-card shadow-sm">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="rounded-2xl border border-border bg-muted p-3">
                    <Server className="h-5 w-5" />
                  </div>

                  <Badge variant={isConnected ? "default" : "destructive"}>
                    {isConnected ? "Connected" : "Unavailable"}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground">API Status</p>
                <p className="mt-1 font-semibold text-foreground">
                  {apiStatusText}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-sm">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="rounded-2xl border border-border bg-muted p-3">
                    <FlaskConical className="h-5 w-5" />
                  </div>

                  <Badge variant="outline">Demo</Badge>
                </div>

                <p className="text-sm text-muted-foreground">Workflow</p>
                <p className="mt-1 font-semibold text-foreground">
                  Load sample, predict, inspect features
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-bold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BadgeCheck;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-muted/40 p-4">
      <div className="mb-3 flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-sm font-medium">{label}</span>
      </div>

      <p className="text-sm font-semibold leading-5 text-foreground">
        {value}
      </p>
    </div>
  );
}