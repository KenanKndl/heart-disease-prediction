"use client";

import { useEffect, useState } from "react";

import { getModelInfo, ModelInfo } from "@/lib/api";
import { LandingHero } from "../components/landing-hero";
import { LandingCta } from "../components/landing-cta";
import { MetricCard } from "@/components/metric-card";
import { PipelineSummary } from "@/components/pipeline-summary";

export default function HomePage() {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  // isLoadingModelInfo stateni sadece hata yönetimini ve loading anını farklı şekilde 
  // yönetmek istersen diye bırakıyoruz, istersen onu da silebilirsin.
  const [isLoadingModelInfo, setIsLoadingModelInfo] = useState(true); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadModelInfo() {
      try {
        setError(null);
        const data = await getModelInfo();
        setModelInfo(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while loading model info.",
        );
      } finally {
        setIsLoadingModelInfo(false);
      }
    }

    loadModelInfo();
  }, []);

  const accuracy = modelInfo?.metrics?.accuracy;
  const macroF1 = modelInfo?.metrics?.macro_f1;
  const macroRecall = modelInfo?.metrics?.macro_recall;
  const selectedFeatureCount =
    modelInfo?.feature_selection?.selected_feature_count;
  const totalFeatureCount =
    modelInfo?.feature_selection?.total_feature_count_before_selection;

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hata veren proplar kaldırıldı, LandingHero artık temiz çağrılıyor */}
      <LandingHero />

      <section className="border-t border-border/40 px-6 py-24">
        {/* Ortak genişlik: 1200px */}
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Model Overview
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Performance summary
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Key evaluation metrics and feature selection details from the
              trained ECG heartbeat classification pipeline.
            </p>
          </div>

          {error ? (
            <div className="mb-6 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Selected Features"
              value={
                selectedFeatureCount && totalFeatureCount
                  ? `${selectedFeatureCount} / ${totalFeatureCount}`
                  : "-"
              }
              description="Selected using SelectKBest"
            />

            <MetricCard
              title="Macro F1-score"
              value={
                macroF1 !== undefined ? `${(macroF1 * 100).toFixed(2)}%` : "-"
              }
              description="Balanced class performance"
            />

            <MetricCard
              title="Macro Recall"
              value={
                macroRecall !== undefined
                  ? `${(macroRecall * 100).toFixed(2)}%`
                  : "-"
              }
              description="Minority class sensitivity"
            />
            
            <MetricCard
              title="Accuracy"
              value={
                accuracy !== undefined ? `${(accuracy * 100).toFixed(2)}%` : "-"
              }
              description="Overall test accuracy"
              isHighlighted={true}
            />
          </div>
        </div>
      </section>

      <section id="methodology" className="px-6 pb-24">
        {/* Ortak genişlik: 1200px */}
        <div className="mx-auto max-w-[1200px]">
          {/* Karttan taşınan başlık - Tam hizalı */}
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Methodology
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              From raw signal to prediction.
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              The workflow follows a compact machine learning pipeline: load a
              heartbeat signal, extract meaningful features, select the strongest
              inputs and classify the final rhythm pattern.
            </p>
          </div>

          <PipelineSummary />
        </div>
      </section>

      <section className="px-6 pb-24">
        {/* Ortak genişlik: 1200px */}
        <div className="mx-auto max-w-[1200px]">
          <LandingCta />
        </div>
      </section>
    </main>
  );
}