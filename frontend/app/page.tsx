"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, BrainCircuit, Database, Loader2, Wand2 } from "lucide-react";

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
import { ProbabilityChart } from "@/components/probability-chart";

export default function HomePage() {
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

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-3xl border bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                <Activity className="h-4 w-4" />
                ECG Heartbeat Classification
              </div>

              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950">
                ECG Arrhythmia Detection with Feature Extraction and Random
                Forest
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                This web interface demonstrates heartbeat classification using
                raw ECG signal points, handcrafted features, SelectKBest feature
                selection and a Random Forest classifier.
              </p>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4">
              <p className="text-sm text-slate-500">API Status</p>
              <p className="mt-1 font-semibold text-slate-900">
                {apiStatusText}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                FastAPI backend: http://127.0.0.1:8000
              </p>
            </div>
          </div>
        </header>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <section className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Accuracy"
            value={accuracy !== undefined ? `${(accuracy * 100).toFixed(2)}%` : "-"}
            description="Overall test accuracy"
          />
          <MetricCard
            title="Macro F1-score"
            value={macroF1 !== undefined ? `${(macroF1 * 100).toFixed(2)}%` : "-"}
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
            value={selectedFeatureCount ? String(selectedFeatureCount) : "-"}
            description="Selected from 205 total features"
          />
        </section>

        <section className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-950">
                  ECG Sample Prediction
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Load a random ECG heartbeat from the test set and classify it
                  using the trained backend model.
                </p>
              </div>

              <Database className="h-7 w-7 text-slate-400" />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleLoadSample}
                disabled={isLoadingSample}
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
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
              </button>

              <button
                type="button"
                onClick={handlePredict}
                disabled={!sample || isPredicting}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
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
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">True Label</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {sample ? sample.true_label : "No sample selected"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Predicted Label</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {prediction ? prediction.predicted_label : "No prediction yet"}
                </p>
              </div>
            </div>

            {prediction ? (
              <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-sm text-emerald-700">Model Confidence</p>
                <p className="mt-1 text-3xl font-bold text-emerald-900">
                  {(prediction.confidence * 100).toFixed(2)}%
                </p>
              </div>
            ) : null}
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">Model Details</h2>

            <div className="mt-4 space-y-4 text-sm">
              <div>
                <p className="font-medium text-slate-500">Model</p>
                <p className="text-slate-900">
                  {modelInfo?.model_name ?? "Loading..."}
                </p>
              </div>

              <div>
                <p className="font-medium text-slate-500">Dataset</p>
                <p className="text-slate-900">
                  {modelInfo?.dataset ?? "Loading..."}
                </p>
              </div>

              <div>
                <p className="font-medium text-slate-500">Approach</p>
                <p className="text-slate-900">
                  {modelInfo?.approach ?? "Loading..."}
                </p>
              </div>

              <div>
                <p className="font-medium text-slate-500">Feature Selection</p>
                <p className="text-slate-900">
                  {modelInfo
                    ? `${modelInfo.feature_selection.method} (${modelInfo.feature_selection.selected_feature_count} / ${modelInfo.feature_selection.total_feature_count_before_selection} features)`
                    : "Loading..."}
                </p>
              </div>
            </div>
          </div>
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