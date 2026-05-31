import { Activity, Database, Server, Sparkles, Waves } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type AppHeaderProps = {
  apiStatusText: string;
  isConnected: boolean;
};

export function AppHeader({ apiStatusText, isConnected }: AppHeaderProps) {
  return (
    <Card className="overflow-hidden border-border/60 bg-background/70 shadow-sm backdrop-blur-xl">
      <CardContent className="relative p-0">
        {/* Ambient background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(14,165,233,0.12),transparent_34%),radial-gradient(circle_at_86%_48%,rgba(14,165,233,0.1),transparent_32%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:36px_36px]" />

        {/* Decorative ECG line */}
        <div className="pointer-events-none absolute right-[-120px] top-1/2 hidden h-52 w-[760px] -translate-y-1/2 opacity-40 lg:block">
          <svg
            className="h-full w-full text-sky-500 drop-shadow-[0_0_18px_rgba(14,165,233,0.35)]"
            viewBox="0 0 600 144"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 72 L 90 72 L 118 52 L 148 92 L 184 30 L 226 114 L 258 72 L 360 72 L 388 52 L 418 92 L 454 30 L 496 114 L 528 72 L 600 72"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="relative grid gap-8 p-7 md:p-9 lg:grid-cols-[1.35fr_0.65fr] lg:p-10">
          {/* Left content */}
          <div className="max-w-4xl">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Badge
                variant="secondary"
                className="gap-1.5 rounded-full border-transparent bg-background/70 px-3 py-1.5 shadow-sm backdrop-blur-md"
              >
                <Activity className="h-3.5 w-3.5" />
                Prediction Workspace
              </Badge>

              <Badge
                variant="outline"
                className="rounded-full border-border/60 bg-background/45 px-3 py-1.5 text-muted-foreground backdrop-blur-md"
              >
                ECG Signal Analysis
              </Badge>

              <Badge
                variant="outline"
                className="rounded-full border-border/60 bg-background/45 px-3 py-1.5 text-muted-foreground backdrop-blur-md"
              >
                Machine Learning Pipeline
              </Badge>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-background/65 shadow-sm backdrop-blur-md sm:flex">
                <Waves className="h-5 w-5 text-sky-500" strokeWidth={1.7} />
              </div>

              <div>
                <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                  Analyze a heartbeat signal in real time.
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
                  Load an ECG sample, run the classifier and inspect how the
                  signal is transformed into features, probabilities and a final
                  arrhythmia prediction.
                </p>
              </div>
            </div>
          </div>

          {/* Right status panel */}
          <div className="flex items-stretch lg:justify-end">
            <div className="relative w-full overflow-hidden rounded-3xl border border-border/60 bg-background/65 p-5 shadow-sm backdrop-blur-xl lg:max-w-sm">
              <div className="absolute right-[-70px] top-[-70px] h-40 w-40 rounded-full bg-sky-400/15 blur-3xl" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                    <span
                      className={
                        isConnected
                          ? "h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_14px_rgba(16,185,129,0.8)]"
                          : "h-2 w-2 rounded-full bg-destructive shadow-[0_0_14px_rgba(239,68,68,0.65)]"
                      }
                    />
                    API Status
                  </div>

                  <p className="text-xl font-semibold tracking-tight text-foreground">
                    {apiStatusText}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Backend connection for live prediction requests.
                  </p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-background/70 p-3 text-sky-500 shadow-sm">
                  <Server className="h-5 w-5" strokeWidth={1.7} />
                </div>
              </div>

              <div className="relative mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-border/50 bg-muted/30 p-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    Backend
                  </p>
                  <p
                    className={
                      isConnected
                        ? "mt-1 font-semibold text-foreground"
                        : "mt-1 font-semibold text-destructive"
                    }
                  >
                    {isConnected ? "Connected" : "Unavailable"}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/50 bg-muted/30 p-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    Mode
                  </p>
                  <p className="mt-1 font-semibold text-foreground">Demo</p>
                </div>
              </div>

              <div className="relative mt-3 flex items-center gap-2 rounded-2xl border border-border/50 bg-muted/25 px-4 py-3 text-xs text-muted-foreground">
                <Database className="h-3.5 w-3.5" />
                Random ECG samples are loaded from the test set.
              </div>

              <div className="relative mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-sky-500" />
                Feature extraction and prediction are handled by the local API.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}