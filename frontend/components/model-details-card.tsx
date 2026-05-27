import { BrainCircuit, CheckCircle2, Layers3 } from "lucide-react";

import { ModelInfo } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type ModelDetailsCardProps = {
  modelInfo: ModelInfo | null;
};

export function ModelDetailsCard({ modelInfo }: ModelDetailsCardProps) {
  const featureSelection = modelInfo?.feature_selection;

  return (
    <Card className="h-full border-border/70 bg-card shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">Model Details</CardTitle>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Summary of the trained classification pipeline.
            </p>
          </div>

          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <BrainCircuit className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-medium text-muted-foreground">Model</p>
            <p className="mt-1 font-semibold text-foreground">
              {modelInfo?.model_name ?? "Loading..."}
            </p>
          </div>

          <div>
            <p className="font-medium text-muted-foreground">Dataset</p>
            <p className="mt-1 font-semibold text-foreground">
              {modelInfo?.dataset ?? "Loading..."}
            </p>
          </div>

          <div>
            <p className="font-medium text-muted-foreground">Approach</p>
            <p className="mt-1 leading-6 text-foreground">
              {modelInfo?.approach ?? "Loading..."}
            </p>
          </div>
        </div>

        <Separator />

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Layers3 className="h-4 w-4 text-primary" />
            <p className="font-semibold text-foreground">Feature Pipeline</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <PipelineStat
              label="Raw ECG Points"
              value={
                modelInfo?.feature_selection
                  ? String(187)
                  : "-"
              }
            />
            <PipelineStat
              label="Extracted Features"
              value={
                modelInfo?.feature_extraction
                  ? String(modelInfo.feature_extraction.extracted_feature_count)
                  : "-"
              }
            />
            <PipelineStat
              label="Total Features"
              value={
                featureSelection
                  ? String(featureSelection.total_feature_count_before_selection)
                  : "-"
              }
            />
            <PipelineStat
              label="Selected Features"
              value={
                featureSelection
                  ? String(featureSelection.selected_feature_count)
                  : "-"
              }
            />
          </div>
        </div>

        <Separator />

        <div>
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <p className="font-semibold text-foreground">Selected Feature Types</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              Raw: {featureSelection?.selected_raw_feature_count ?? "-"}
            </Badge>
            <Badge variant="secondary">
              Extracted:{" "}
              {featureSelection?.selected_extracted_feature_count ?? "-"}
            </Badge>
            <Badge variant="outline">
              {featureSelection?.method ?? "SelectKBest"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PipelineStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-muted/40 p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}