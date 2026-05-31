import { BrainCircuit, CheckCircle2, Layers3 } from "lucide-react";

import { ModelInfo } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

type ModelDetailsCardProps = {
  modelInfo: ModelInfo | null;
};

export function ModelDetailsCard({ modelInfo }: ModelDetailsCardProps) {
  const featureSelection = modelInfo?.feature_selection;

  return (
    <div className="rounded-[2rem] border border-border/40 bg-background p-6 md:p-10">
      
      {/* Üst Kısım: Başlık */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Model Details
          </p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Trained classification pipeline
          </h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Summary of the model, dataset, feature extraction and feature
            selection configuration used by the prediction backend.
          </p>
        </div>

        {/* İkon için daha yumuşak ve yuvarlak bir arka plan */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted/10 text-foreground shadow-sm">
          <BrainCircuit className="h-5 w-5" strokeWidth={1.5} />
        </div>
      </div>

      {/* Ana Bilgi Bloğu (Kutular yerine tek ve şık bir blok) */}
      <div className="rounded-[1.5rem] border border-border/40 bg-muted/5 p-6 md:p-8">
        <div className="grid gap-8 md:grid-cols-3">
          <InfoItem label="Model" value={modelInfo?.model_name ?? "Loading..."} />
          <InfoItem label="Dataset" value={modelInfo?.dataset ?? "Loading..."} />
          <InfoItem label="Method" value={featureSelection?.method ?? "SelectKBest"} />
        </div>

        {/* İnce ayırıcı çizgi */}
        <div className="my-6 h-px w-full bg-border/40" />

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Approach</span>
          <span className="text-sm font-medium leading-relaxed text-foreground">
            {modelInfo?.approach ?? "Loading..."}
          </span>
        </div>
      </div>

      {/* Feature Pipeline İstatistikleri (Ayrı kartlar yerine tek bir şerit/strip) */}
      <div className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          <Layers3 className="h-4.5 w-4.5 text-muted-foreground" strokeWidth={1.5} />
          <h4 className="text-sm font-semibold text-foreground">Feature Pipeline</h4>
        </div>

        <div className="grid overflow-hidden rounded-[1.5rem] border border-border/40 bg-background sm:grid-cols-4 sm:divide-x sm:divide-border/40 divide-y divide-border/40 sm:divide-y-0">
          <PipelineStat
            label="Raw ECG Points"
            value={modelInfo?.feature_selection ? String(187) : "-"}
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

      {/* Selected Feature Types (Daha temiz badgeler) */}
      <div className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-4.5 w-4.5 text-muted-foreground" strokeWidth={1.5} />
          <h4 className="text-sm font-semibold text-foreground">Selected Feature Types</h4>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Badge variant="secondary" className="rounded-full bg-muted/10 px-4 py-1.5 text-xs font-medium hover:bg-muted/20">
            <span className="text-muted-foreground mr-1">Raw:</span> 
            <span className="text-foreground">{featureSelection?.selected_raw_feature_count ?? "-"}</span>
          </Badge>

          <Badge variant="secondary" className="rounded-full bg-muted/10 px-4 py-1.5 text-xs font-medium hover:bg-muted/20">
            <span className="text-muted-foreground mr-1">Extracted:</span> 
            <span className="text-foreground">{featureSelection?.selected_extracted_feature_count ?? "-"}</span>
          </Badge>

          <Badge variant="outline" className="rounded-full border-border/40 px-4 py-1.5 text-xs font-medium text-muted-foreground">
            {featureSelection?.method ?? "SelectKBest"}
          </Badge>
        </div>
      </div>
    </div>
  );
}

// Yardımcı Bileşenler
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

function PipelineStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col justify-center bg-muted/5 p-5 transition-colors hover:bg-muted/10">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">
        {value}
      </span>
    </div>
  );
}