"use client";

import { useEffect, useMemo, useState } from "react";
import { BrainCircuit, Loader2, Wand2 } from "lucide-react";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <main className="min-h-[calc(100vh-4rem)] bg-background px-6 py-8 text-foreground">
      <div className="mx-auto max-w-[1320px]">
        <section className="mb-8 flex flex-col gap-4 rounded-3xl border border-border/70 bg-card p-6 shadow-sm md:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge variant="secondary" className="mb-3 rounded-full px-3 py-1">
              Prediction Workspace
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              ECG Sample Prediction
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
              Load a random ECG heartbeat from the test set, run the trained backend model,
              and inspect the prediction result with charts and extracted features.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-muted/30 px-4 py-3 text-sm">
            <p className="text-muted-foreground">API Status</p>
            <p className="mt-1 font-semibold text-foreground">{apiStatusText}</p>
          </div>
        </section>

        {error ? (
          <div className="mb-6 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Accuracy"
            value={
              accuracy !== undefined ? `${(accuracy * 100).toFixed(2)}%` : "-"
            }
            description="Overall test accuracy"
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
            title="Selected Features"
            value={
              selectedFeatureCount && totalFeatureCount
                ? `${selectedFeatureCount} / ${totalFeatureCount}`
                : "-"
            }
            description="Selected using SelectKBest"
          />
        </section>

        <section className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-border/70 bg-card shadow-sm">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    ECG Sample Prediction
                  </CardTitle>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Load a random ECG heartbeat from the test set and classify
                    it using the trained backend model.
                  </p>
                </div>

                {isPredictionCorrect !== null ? (
                  <Badge
                    variant={isPredictionCorrect ? "default" : "destructive"}
                    className="w-fit rounded-full px-3 py-1"
                  >
                    {isPredictionCorrect
                      ? "Prediction Correct"
                      : "Prediction Mismatch"}
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="w-fit rounded-full px-3 py-1"
                  >
                    Waiting for prediction
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  onClick={handleLoadSample}
                  disabled={isLoadingSample}
                  className="rounded-xl"
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
                  className="rounded-xl"
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

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-muted/40 p-4">
                  <p className="text-sm text-muted-foreground">True Label</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {sample ? sample.true_label : "No sample selected"}
                  </p>
                  {sample ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Class ID: {sample.true_class}
                    </p>
                  ) : null}
                </div>

                <div className="rounded-2xl border border-border/70 bg-muted/40 p-4">
                  <p className="text-sm text-muted-foreground">
                    Predicted Label
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {prediction
                      ? prediction.predicted_label
                      : "No prediction yet"}
                  </p>
                  {prediction ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Class ID: {prediction.predicted_class}
                    </p>
                  ) : null}
                </div>
              </div>

              {prediction ? (
                <div className="mt-5 rounded-2xl border border-border/70 bg-muted/30 p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Model Confidence
                      </p>
                      <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                        {(prediction.confidence * 100).toFixed(2)}%
                      </p>
                    </div>

                    <Badge variant="outline" className="rounded-full px-3 py-1">
                      {prediction.selected_feature_count} selected features
                    </Badge>
                  </div>

                  <Progress value={prediction.confidence * 100} />
                </div>
              ) : null}
            </CardContent>
          </Card>

          <ModelDetailsCard modelInfo={modelInfo} />
        </section>

        {sample ? (
          <section className="mb-8">
            <EcgChart signal={sample.signal} />
          </section>
        ) : null}

        {prediction ? (
          <section className="grid gap-6 lg:grid-cols-2">
            <ProbabilityChart probabilities={prediction.probabilities} />
            <FeatureTable features={prediction.extracted_features} />
          </section>
        ) : null}

      </div>
    </main>
  );
}