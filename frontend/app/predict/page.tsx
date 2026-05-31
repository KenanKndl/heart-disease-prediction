"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BrainCircuit,
  CheckCircle2,
  Loader2,
  Server,
  Wand2,
  XCircle,
} from "lucide-react";

import {
  getModelInfo,
  getRandomSample,
  ModelInfo,
  PredictResponse,
  predictSignal,
  SampleResponse,
} from "@/lib/api";

import { EcgChart } from "@/components/ecg-chart";
import { FeatureTable } from "@/components/feature-table";
import { MetricCard } from "@/components/metric-card";
import { ModelDetailsCard } from "@/components/model-details-card";
import { ProbabilityChart } from "@/components/probability-chart";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function PredictPage() {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [sample, setSample] = useState<SampleResponse | null>(null);
  const [prediction, setPrediction] = useState<PredictResponse | null>(null);

  const [isLoadingModelInfo, setIsLoadingModelInfo] = useState(true);
  const [isLoadingSample, setIsLoadingSample] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiStatusText = useMemo(() => {
    if (isLoadingModelInfo) return "Connecting to backend...";
    if (modelInfo) return "Backend connected";
    return "Backend unavailable";
  }, [isLoadingModelInfo, modelInfo]);

  const isPredictionCorrect =
    sample && prediction
      ? sample.true_class === prediction.predicted_class
      : null;

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

  async function handleLoadSample() {
    try {
      setError(null);
      setIsLoadingSample(true);
      setPrediction(null);

      const data = await getRandomSample();
      setSample(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while loading sample.",
      );
    } finally {
      setIsLoadingSample(false);
    }
  }

  async function handlePredict() {
    if (!sample) return;

    try {
      setError(null);
      setIsPredicting(true);

      const data = await predictSignal(sample.signal);
      setPrediction(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during prediction.",
      );
    } finally {
      setIsPredicting(false);
    }
  }

  const accuracy = modelInfo?.metrics?.accuracy;
  const macroF1 = modelInfo?.metrics?.macro_f1;
  const macroRecall = modelInfo?.metrics?.macro_recall;
  const selectedFeatureCount =
    modelInfo?.feature_selection?.selected_feature_count;
  const totalFeatureCount =
    modelInfo?.feature_selection?.total_feature_count_before_selection;

  return (
    <main className="min-h-screen w-full bg-background px-6 py-12 text-foreground">
      <div className="mx-auto w-full max-w-[1200px]">
        <section className="mb-10">
          <div className="flex flex-col gap-6 border-b border-border/50 pb-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Prediction Workspace
              </p>

              <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                ECG sample prediction
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                Load a random ECG heartbeat from the test set, run the trained
                backend model and inspect the result through signal, probability
                and feature-level outputs.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 text-sm text-muted-foreground">
              <Server className="h-4 w-4" strokeWidth={1.7} />
              <span>
                Status:{" "}
                <span
                  className={
                    modelInfo
                      ? "font-medium text-foreground"
                      : "text-destructive"
                  }
                >
                  {apiStatusText}
                </span>
              </span>
            </div>
          </div>
        </section>

        {error ? (
          <div className="mb-8 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : null}

<section className="mb-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
        </section>

<section className="mb-10 rounded-[2rem] border border-border/60 bg-background p-6 md:p-8">
          {/* Boşluklar (mb-10 -> mb-6, pb-10 -> pb-6) daraltıldı ve çizgiler yumuşatıldı */}
          <div className="mb-6 flex flex-col gap-6 border-b border-border/40 pb-6">
            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  Step 01
                </Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1 text-muted-foreground">
                  Random test sample
                </Badge>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Load a heartbeat and run prediction.
              </h2>
              
              <p className="mt-2 text-base leading-7 text-muted-foreground">
                Start by loading a random 187-point ECG segment. After the sample
                is loaded, run the classifier to compare the model prediction
                with the original test label.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={handleLoadSample}
                disabled={isLoadingSample}
                className="h-11 rounded-2xl px-6"
              >
                {isLoadingSample ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading Sample
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Random ECG Sample
                  </>
                )}
              </Button>

              <Button
                type="button"
                onClick={handlePredict}
                disabled={!sample || isPredicting}
                variant="secondary"
                className="h-11 rounded-2xl px-6"
              >
                {isPredicting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Predicting
                  </>
                ) : (
                  <>
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    Predict
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-border/40 bg-muted/10 p-5">
              <p className="text-sm font-medium text-muted-foreground">True Label</p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                {sample ? sample.true_label : "No sample selected"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {sample ? `Class ID: ${sample.true_class}` : "Load a sample to view."}
              </p>
            </div>

            <div className="rounded-2xl border border-border/40 bg-muted/10 p-5">
              <p className="text-sm font-medium text-muted-foreground">Predicted Label</p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                {prediction ? prediction.predicted_label : "No prediction yet"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {prediction ? `Class ID: ${prediction.predicted_class}` : "Run prediction."}
              </p>
            </div>

            <div className="rounded-2xl border border-border/40 bg-muted/10 p-5">
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <div className="mt-2 flex items-center gap-2">
                {isPredictionCorrect === null ? (
                  <>
                    <Activity className="h-4.5 w-4.5 text-muted-foreground" />
                    <p className="text-xl font-semibold tracking-tight text-foreground">Waiting</p>
                  </>
                ) : isPredictionCorrect ? (
                  <>
                    <CheckCircle2 className="h-4.5 w-4.5 text-foreground" />
                    <p className="text-xl font-semibold tracking-tight text-foreground">Correct</p>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4.5 w-4.5 text-destructive" />
                    <p className="text-xl font-semibold tracking-tight text-destructive">Mismatch</p>
                  </>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {isPredictionCorrect === null ? "Awaiting input." : "Comparison complete."}
              </p>
            </div>
          </div>

          {prediction ? (
            <div className="mt-4 rounded-2xl border border-border/40 bg-background p-5">
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Model Confidence</p>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                    {(prediction.confidence * 100).toFixed(2)}%
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {prediction.selected_feature_count} features used
                </span>
              </div>
              <Progress value={prediction.confidence * 100} className="h-2" />
            </div>
          ) : null}
        </section>

        {sample ? (
          <section className="mb-10">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Signal View
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
                Loaded ECG signal
              </h2>
            </div>

            <EcgChart signal={sample.signal} />
          </section>
        ) : null}

        {prediction ? (
          <section className="mb-10">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Prediction Output
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
                Probabilities and extracted features
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Review class probabilities returned by the model and the
                statistical features extracted from the ECG segment.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <ProbabilityChart probabilities={prediction.probabilities} />
              <FeatureTable features={prediction.extracted_features} />
            </div>
          </section>
        ) : null}

        <section>
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Model Information
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
              Classification pipeline details
            </h2>
          </div>

          <ModelDetailsCard modelInfo={modelInfo} />
        </section>
      </div>
    </main>
  );
}