import json
import os
import sys
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import yaml

from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.preprocessing import StandardScaler

PROJECT_ROOT = Path(__file__).resolve().parents[2]
sys.path.append(str(PROJECT_ROOT))

from backend.app.services.feature_extraction import (
    FEATURE_NAMES,
    extract_features_from_dataframe,
)

from backend.training.report_generator import (
    ensure_report_dirs,
    save_class_distribution,
    save_classification_report_outputs,
    save_confusion_matrices,
    save_feature_importance,
    save_learning_curve,
    save_metrics_summary,
    save_selected_features,
)


def load_config() -> dict:
    config_path = PROJECT_ROOT / "backend" / "config" / "config.yaml"

    if not config_path.exists():
        raise FileNotFoundError(f"Config file not found: {config_path}")

    with open(config_path, "r", encoding="utf-8") as file:
        return yaml.safe_load(file)


def load_dataset(train_path: str, test_path: str):
    train_file = PROJECT_ROOT / train_path
    test_file = PROJECT_ROOT / test_path

    if not train_file.exists():
        raise FileNotFoundError(f"Train dataset not found: {train_file}")

    if not test_file.exists():
        raise FileNotFoundError(f"Test dataset not found: {test_file}")

    train_df = pd.read_csv(train_file, header=None)
    test_df = pd.read_csv(test_file, header=None)

    print("Dataset loaded.")
    print(f"Train shape: {train_df.shape}")
    print(f"Test shape: {test_df.shape}")

    X_train_raw = train_df.iloc[:, :-1]
    y_train = train_df.iloc[:, -1].astype(int)

    X_test_raw = test_df.iloc[:, :-1]
    y_test = test_df.iloc[:, -1].astype(int)

    raw_feature_names = [f"ecg_point_{i}" for i in range(X_train_raw.shape[1])]

    X_train_raw.columns = raw_feature_names
    X_test_raw.columns = raw_feature_names

    print("\nClass distribution in train:")
    print(y_train.value_counts().sort_index())

    print("\nClass distribution in test:")
    print(y_test.value_counts().sort_index())

    return X_train_raw, y_train, X_test_raw, y_test, raw_feature_names


def build_feature_matrix(
    X_raw: pd.DataFrame,
    use_raw_signal: bool,
    use_extracted_features: bool,
) -> pd.DataFrame:
    """
    Builds the final feature matrix.

    Depending on configuration, it can use:
    - raw ECG signal points,
    - extracted statistical/peak-based features,
    - or both.
    """

    feature_parts = []

    if use_raw_signal:
        raw_features = X_raw.reset_index(drop=True).copy()
        feature_parts.append(raw_features)

    if use_extracted_features:
        extracted_features = extract_features_from_dataframe(X_raw)
        extracted_features = extracted_features.reset_index(drop=True)
        feature_parts.append(extracted_features)

    if not feature_parts:
        raise ValueError("At least one feature source must be enabled.")

    return pd.concat(feature_parts, axis=1)


def train():
    config = load_config()

    train_path = config["dataset"]["train_path"]
    test_path = config["dataset"]["test_path"]

    output_dir = PROJECT_ROOT / config["model"]["output_dir"]
    model_path = PROJECT_ROOT / config["model"]["model_path"]
    scaler_path = PROJECT_ROOT / config["model"]["scaler_path"]
    selector_path = PROJECT_ROOT / config["model"]["selector_path"]
    metadata_path = PROJECT_ROOT / config["model"]["metadata_path"]
    figures_dir = PROJECT_ROOT / config["reports"]["figures_dir"]
    tables_dir = PROJECT_ROOT / config["reports"]["tables_dir"]
    ensure_report_dirs(figures_dir, tables_dir)

    random_state = config["training"]["random_state"]
    selected_feature_count = config["training"]["selected_feature_count"]
    n_estimators = config["training"]["n_estimators"]

    use_raw_signal = config.get("features", {}).get("use_raw_signal", True)
    use_extracted_features = config.get("features", {}).get("use_extracted_features", True)

    os.makedirs(output_dir, exist_ok=True)

    X_train_raw, y_train, X_test_raw, y_test, raw_feature_names = load_dataset(
        train_path,
        test_path,
    )

    save_class_distribution(
    y_train=y_train,
    y_test=y_test,
    class_names=config["classes"],
    figures_dir=figures_dir,
    tables_dir=tables_dir,
    )

    print("\nBuilding train feature matrix...")
    print(f"Use raw signal: {use_raw_signal}")
    print(f"Use extracted features: {use_extracted_features}")

    X_train_features = build_feature_matrix(
        X_train_raw,
        use_raw_signal=use_raw_signal,
        use_extracted_features=use_extracted_features,
    )

    print("Building test feature matrix...")
    X_test_features = build_feature_matrix(
        X_test_raw,
        use_raw_signal=use_raw_signal,
        use_extracted_features=use_extracted_features,
    )

    all_feature_names = list(X_train_features.columns)

    print("\nFeature matrix completed.")
    print(f"Total feature count before selection: {X_train_features.shape[1]}")
    print(f"Raw signal feature count: {len(raw_feature_names) if use_raw_signal else 0}")
    print(f"Extracted feature count: {len(FEATURE_NAMES) if use_extracted_features else 0}")

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train_features)
    X_test_scaled = scaler.transform(X_test_features)

    k = min(selected_feature_count, X_train_features.shape[1])

    selector = SelectKBest(score_func=f_classif, k=k)
    X_train_selected = selector.fit_transform(X_train_scaled, y_train)
    X_test_selected = selector.transform(X_test_scaled)

    selected_features = np.array(all_feature_names)[selector.get_support()].tolist()

    save_selected_features(
        selector=selector,
        all_feature_names=all_feature_names,
        selected_features=selected_features,
        figures_dir=figures_dir,
        tables_dir=tables_dir,
    )

    selected_raw_features = [
        feature for feature in selected_features if feature.startswith("ecg_point_")
    ]

    selected_extracted_features = [
        feature for feature in selected_features if not feature.startswith("ecg_point_")
    ]

    print("\nFeature selection completed.")
    print(f"Selected feature count: {len(selected_features)}")
    print(f"Selected raw ECG points: {len(selected_raw_features)}")
    print(f"Selected extracted features: {len(selected_extracted_features)}")
    print(f"Selected extracted feature names: {selected_extracted_features}")

    model = RandomForestClassifier(
        n_estimators=n_estimators,
        class_weight="balanced",
        random_state=random_state,
        n_jobs=-1,
    )

    print("\nTraining Random Forest model...")
    model.fit(X_train_selected, y_train)

    print("Model training completed.")

    y_pred = model.predict(X_test_selected)

    accuracy = accuracy_score(y_test, y_pred)
    macro_precision = precision_score(y_test, y_pred, average="macro", zero_division=0)
    macro_recall = recall_score(y_test, y_pred, average="macro", zero_division=0)
    macro_f1 = f1_score(y_test, y_pred, average="macro", zero_division=0)
    weighted_f1 = f1_score(y_test, y_pred, average="weighted", zero_division=0)

    report = classification_report(y_test, y_pred, zero_division=0)
    matrix = confusion_matrix(y_test, y_pred)

    save_metrics_summary(
        accuracy=accuracy,
        macro_precision=macro_precision,
        macro_recall=macro_recall,
        macro_f1=macro_f1,
        weighted_f1=weighted_f1,
        tables_dir=tables_dir,
    )

    save_confusion_matrices(
        y_test=y_test,
        y_pred=y_pred,
        class_names=config["classes"],
        figures_dir=figures_dir,
        tables_dir=tables_dir,
    )

    save_classification_report_outputs(
        y_test=y_test,
        y_pred=y_pred,
        class_names=config["classes"],
        figures_dir=figures_dir,
        tables_dir=tables_dir,
    )

    save_feature_importance(
        model=model,
        selected_features=selected_features,
        figures_dir=figures_dir,
        tables_dir=tables_dir,
    )

    print("\nGenerating learning curve...")
    save_learning_curve(
        model=model,
        X=X_train_selected,
        y=y_train,
        figures_dir=figures_dir,
        random_state=random_state,
    )
    print("Learning curve saved.")

    print("\nEvaluation Results")
    print("------------------")
    print(f"Accuracy: {accuracy:.4f}")
    print(f"Macro Precision: {macro_precision:.4f}")
    print(f"Macro Recall: {macro_recall:.4f}")
    print(f"Macro F1-score: {macro_f1:.4f}")
    print(f"Weighted F1-score: {weighted_f1:.4f}")

    print("\nClassification Report:")
    print(report)

    print("\nConfusion Matrix:")
    print(matrix)

    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    joblib.dump(selector, selector_path)

    metadata = {
        "model_name": "Random Forest Classifier",
        "dataset": "MIT-BIH ECG Heartbeat Dataset",
        "approach": "Raw ECG signal points + handcrafted extracted features",
        "feature_extraction": {
            "enabled": use_extracted_features,
            "extracted_feature_count": len(FEATURE_NAMES) if use_extracted_features else 0,
            "all_extracted_features": FEATURE_NAMES if use_extracted_features else [],
        },
        "raw_signal": {
            "enabled": use_raw_signal,
            "raw_feature_count": len(raw_feature_names) if use_raw_signal else 0,
        },
        "feature_selection": {
            "method": "SelectKBest",
            "score_function": "ANOVA F-value",
            "total_feature_count_before_selection": len(all_feature_names),
            "selected_feature_count": len(selected_features),
            "selected_features": selected_features,
            "selected_raw_feature_count": len(selected_raw_features),
            "selected_extracted_feature_count": len(selected_extracted_features),
            "selected_extracted_features": selected_extracted_features,
        },
        "classes": config["classes"],
        "metrics": {
            "accuracy": round(float(accuracy), 4),
            "macro_precision": round(float(macro_precision), 4),
            "macro_recall": round(float(macro_recall), 4),
            "macro_f1": round(float(macro_f1), 4),
            "weighted_f1": round(float(weighted_f1), 4),
        },
        "confusion_matrix": matrix.tolist(),
    }

    with open(metadata_path, "w", encoding="utf-8") as file:
        json.dump(metadata, file, indent=4, ensure_ascii=False)

    print("\nSaved files:")
    print(f"Model: {model_path}")
    print(f"Scaler: {scaler_path}")
    print(f"Selector: {selector_path}")
    print(f"Metadata: {metadata_path}")
    print(f"Figures: {figures_dir}")
    print(f"Tables: {tables_dir}")

if __name__ == "__main__":
    train()