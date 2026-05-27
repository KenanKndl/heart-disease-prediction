import { Activity, Database, Server } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type AppHeaderProps = {
  apiStatusText: string;
  isConnected: boolean;
};

export function AppHeader({ apiStatusText, isConnected }: AppHeaderProps) {
  return (
    <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
      <CardContent className="relative p-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-emerald-500/10" />

        <div className="relative grid gap-8 p-8 lg:grid-cols-[1.4fr_0.6fr] lg:p-10">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1">
                <Activity className="h-3.5 w-3.5" />
                ECG Heartbeat Classification
              </Badge>

              <Badge variant="outline" className="rounded-full px-3 py-1">
                MIT-BIH Dataset
              </Badge>

              <Badge variant="outline" className="rounded-full px-3 py-1">
                Random Forest
              </Badge>
            </div>

            <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Arrhythmia Detection with Feature Extraction and Machine Learning
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground">
              This interface demonstrates ECG heartbeat classification using raw
              ECG signal points, handcrafted features, SelectKBest feature
              selection and a Random Forest classifier.
            </p>
          </div>

          <div className="flex items-stretch">
            <div className="w-full rounded-2xl border border-border/70 bg-background/70 p-5 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">API Status</p>
                  <p className="mt-1 font-semibold text-foreground">
                    {apiStatusText}
                  </p>
                </div>

                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <Server className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Backend</span>
                  <Badge variant={isConnected ? "default" : "destructive"}>
                    {isConnected ? "Connected" : "Unavailable"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">API</span>
                  <span className="font-medium text-foreground">
                    127.0.0.1:8000
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Mode</span>
                  <span className="font-medium text-foreground">Demo</span>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
                <Database className="h-3.5 w-3.5" />
                Random samples are loaded from the test set.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}