const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export type ModelInfo = {
  model_name: string;
  dataset: string;
  approach?: string;
  classes: Record<string, string>;
  metrics: Record<string, number>;
  feature_extraction: {
    enabled: boolean;
    extracted_feature_count: number;
    all_extracted_features: string[];
  };
  feature_selection: {
    method: string;
    score_function: string;
    total_feature_count_before_selection: number;
    selected_feature_count: number;
    selected_features: string[];
    selected_raw_feature_count: number;
    selected_extracted_feature_count: number;
    selected_extracted_features: string[];
  };
};

export type SampleResponse = {
  signal: number[];
  true_class: number;
  true_label: string;
};

export type PredictResponse = {
  predicted_class: number;
  predicted_label: string;
  confidence: number;
  probabilities: Record<string, number>;
  extracted_features: Record<string, number>;
  selected_feature_count: number;
};

export async function getModelInfo(): Promise<ModelInfo> {
  const response = await fetch(`${API_URL}/model-info`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Model information could not be loaded.");
  }

  return response.json();
}

export async function getRandomSample(): Promise<SampleResponse> {
  const response = await fetch(`${API_URL}/sample`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Random ECG sample could not be loaded.");
  }

  return response.json();
}

export async function predictSignal(signal: number[]): Promise<PredictResponse> {
  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ signal }),
  });

  if (!response.ok) {
    throw new Error("Prediction request failed.");
  }

  return response.json();
}