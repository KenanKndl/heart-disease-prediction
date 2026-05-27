from typing import Dict, List

import numpy as np
import pandas as pd

from backend.app.services.feature_extraction import extract_features_from_signal
from backend.app.services.model_loader import model_artifacts


EXPECTED_SIGNAL_LENGTH = 187


def _validate_signal(signal: List[float]) -> np.ndarray:
    if len(signal) != EXPECTED_SIGNAL_LENGTH:
        raise ValueError(
            f"Invalid signal length. Expected {EXPECTED_SIGNAL_LENGTH}, got {len(signal)}."
        )

    signal_array = np.asarray(signal, dtype=float)

    if np.isnan(signal_array).any():
        raise ValueError("Signal contains NaN values.")

    if np.isinf(signal_array).any():
        raise ValueError("Signal contains infinite values.")

    return signal_array


def _build_single_feature_row(signal_array: np.ndarray) -> pd.DataFrame:
    raw_feature_names = [f"ecg_point_{i}" for i in range(EXPECTED_SIGNAL_LENGTH)]

    raw_features = {
        feature_name: signal_array[index]
        for index, feature_name in enumerate(raw_feature_names)
    }

    extracted_features = extract_features_from_signal(signal_array)

    combined_features = {
        **raw_features,
        **extracted_features,
    }

    return pd.DataFrame([combined_features])


def predict_single(signal: List[float]) -> Dict:
    signal_array = _validate_signal(signal)

    artifacts = model_artifacts

    if artifacts.model is None:
        artifacts.load()

    feature_row = _build_single_feature_row(signal_array)

    scaled_features = artifacts.scaler.transform(feature_row)
    selected_features = artifacts.selector.transform(scaled_features)

    predicted_class = int(artifacts.model.predict(selected_features)[0])

    probabilities_raw = artifacts.model.predict_proba(selected_features)[0]
    class_labels = artifacts.model.classes_

    classes_map = artifacts.metadata["classes"]

    probabilities = {}

    for class_id, probability in zip(class_labels, probabilities_raw):
        class_id_int = int(class_id)
        class_name = classes_map[str(class_id_int)]
        probabilities[class_name] = round(float(probability), 4)

    predicted_label = classes_map[str(predicted_class)]
    confidence = round(float(np.max(probabilities_raw)), 4)

    extracted_features = extract_features_from_signal(signal_array)

    return {
        "predicted_class": predicted_class,
        "predicted_label": predicted_label,
        "confidence": confidence,
        "probabilities": probabilities,
        "extracted_features": extracted_features,
        "selected_feature_count": artifacts.metadata["feature_selection"][
            "selected_feature_count"
        ],
    }