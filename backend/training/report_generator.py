from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

from sklearn.metrics import ConfusionMatrixDisplay, classification_report
from sklearn.model_selection import learning_curve


def ensure_report_dirs(figures_dir: Path, tables_dir: Path) -> None:
    figures_dir.mkdir(parents=True, exist_ok=True)
    tables_dir.mkdir(parents=True, exist_ok=True)


def save_class_distribution(
    y_train,
    y_test,
    class_names: dict,
    figures_dir: Path,
    tables_dir: Path,
) -> None:
    train_counts = y_train.value_counts().sort_index()
    test_counts = y_test.value_counts().sort_index()

    train_df = pd.DataFrame({
        "class_id": train_counts.index,
        "class_name": [class_names[str(i)] for i in train_counts.index],
        "count": train_counts.values,
    })

    test_df = pd.DataFrame({
        "class_id": test_counts.index,
        "class_name": [class_names[str(i)] for i in test_counts.index],
        "count": test_counts.values,
    })

    train_df.to_csv(tables_dir / "class_distribution_train.csv", index=False)
    test_df.to_csv(tables_dir / "class_distribution_test.csv", index=False)

    plt.figure(figsize=(10, 6))
    plt.bar(train_df["class_name"], train_df["count"])
    plt.title("Training Set Class Distribution")
    plt.xlabel("Class")
    plt.ylabel("Sample Count")
    plt.xticks(rotation=30, ha="right")
    plt.tight_layout()
    plt.savefig(figures_dir / "class_distribution_train.png", dpi=300)
    plt.close()

    plt.figure(figsize=(10, 6))
    plt.bar(test_df["class_name"], test_df["count"])
    plt.title("Test Set Class Distribution")
    plt.xlabel("Class")
    plt.ylabel("Sample Count")
    plt.xticks(rotation=30, ha="right")
    plt.tight_layout()
    plt.savefig(figures_dir / "class_distribution_test.png", dpi=300)
    plt.close()


def save_confusion_matrices(
    y_test,
    y_pred,
    class_names: dict,
    figures_dir: Path,
    tables_dir: Path,
) -> None:
    labels = sorted([int(key) for key in class_names.keys()])
    display_labels = [class_names[str(label)] for label in labels]

    cm = pd.crosstab(
        pd.Series(y_test, name="Actual"),
        pd.Series(y_pred, name="Predicted"),
        dropna=False,
    )

    cm.to_csv(tables_dir / "confusion_matrix.csv")

    plt.figure(figsize=(10, 8))
    ConfusionMatrixDisplay.from_predictions(
        y_test,
        y_pred,
        labels=labels,
        display_labels=display_labels,
        xticks_rotation=35,
        values_format="d",
    )
    plt.title("Confusion Matrix")
    plt.tight_layout()
    plt.savefig(figures_dir / "confusion_matrix.png", dpi=300)
    plt.close()

    plt.figure(figsize=(10, 8))
    ConfusionMatrixDisplay.from_predictions(
        y_test,
        y_pred,
        labels=labels,
        display_labels=display_labels,
        normalize="true",
        xticks_rotation=35,
        values_format=".2f",
    )
    plt.title("Normalized Confusion Matrix")
    plt.tight_layout()
    plt.savefig(figures_dir / "normalized_confusion_matrix.png", dpi=300)
    plt.close()


def save_classification_report_outputs(
    y_test,
    y_pred,
    class_names: dict,
    figures_dir: Path,
    tables_dir: Path,
) -> None:
    report_dict = classification_report(
        y_test,
        y_pred,
        output_dict=True,
        zero_division=0,
    )

    report_df = pd.DataFrame(report_dict).transpose()
    report_df.to_csv(tables_dir / "classification_report.csv")

    class_ids = sorted([int(key) for key in class_names.keys()])
    class_labels = [str(class_id) for class_id in class_ids]
    class_display_names = [class_names[str(class_id)] for class_id in class_ids]

    metrics_df = report_df.loc[class_labels, ["precision", "recall", "f1-score"]]
    metrics_df.index = class_display_names

    ax = metrics_df.plot(kind="bar", figsize=(12, 7))
    ax.set_title("Per-Class Precision, Recall and F1-score")
    ax.set_xlabel("Class")
    ax.set_ylabel("Score")
    ax.set_ylim(0, 1.05)
    plt.xticks(rotation=30, ha="right")
    plt.legend(loc="lower right")
    plt.tight_layout()
    plt.savefig(figures_dir / "class_metrics.png", dpi=300)
    plt.close()


def save_metrics_summary(
    accuracy: float,
    macro_precision: float,
    macro_recall: float,
    macro_f1: float,
    weighted_f1: float,
    tables_dir: Path,
) -> None:
    metrics_df = pd.DataFrame([
        {"metric": "accuracy", "score": accuracy},
        {"metric": "macro_precision", "score": macro_precision},
        {"metric": "macro_recall", "score": macro_recall},
        {"metric": "macro_f1", "score": macro_f1},
        {"metric": "weighted_f1", "score": weighted_f1},
    ])

    metrics_df.to_csv(tables_dir / "metrics_summary.csv", index=False)


def save_selected_features(
    selector,
    all_feature_names,
    selected_features,
    figures_dir: Path,
    tables_dir: Path,
) -> None:
    scores = selector.scores_

    feature_scores_df = pd.DataFrame({
        "feature": all_feature_names,
        "score": scores,
        "selected": [feature in selected_features for feature in all_feature_names],
    })

    feature_scores_df = feature_scores_df.sort_values("score", ascending=False)
    feature_scores_df.to_csv(tables_dir / "feature_selection_scores.csv", index=False)

    selected_features_df = feature_scores_df[feature_scores_df["selected"]].copy()
    selected_features_df.to_csv(tables_dir / "selected_features.csv", index=False)

    top_scores_df = feature_scores_df.head(30).copy()

    plt.figure(figsize=(12, 8))
    plt.barh(top_scores_df["feature"][::-1], top_scores_df["score"][::-1])
    plt.title("Top 30 Feature Selection Scores - SelectKBest")
    plt.xlabel("ANOVA F-value Score")
    plt.ylabel("Feature")
    plt.tight_layout()
    plt.savefig(figures_dir / "feature_selection_scores.png", dpi=300)
    plt.close()


def save_feature_importance(
    model,
    selected_features,
    figures_dir: Path,
    tables_dir: Path,
) -> None:
    if not hasattr(model, "feature_importances_"):
        return

    importance_df = pd.DataFrame({
        "feature": selected_features,
        "importance": model.feature_importances_,
    })

    importance_df = importance_df.sort_values("importance", ascending=False)
    importance_df.to_csv(tables_dir / "feature_importance.csv", index=False)

    top_importance_df = importance_df.head(30).copy()

    plt.figure(figsize=(12, 8))
    plt.barh(top_importance_df["feature"][::-1], top_importance_df["importance"][::-1])
    plt.title("Top 30 Random Forest Feature Importances")
    plt.xlabel("Importance")
    plt.ylabel("Feature")
    plt.tight_layout()
    plt.savefig(figures_dir / "feature_importance.png", dpi=300)
    plt.close()


def save_learning_curve(
    model,
    X,
    y,
    figures_dir: Path,
    random_state: int,
) -> None:
    train_sizes, train_scores, validation_scores = learning_curve(
        estimator=model,
        X=X,
        y=y,
        cv=3,
        scoring="f1_macro",
        n_jobs=-1,
        train_sizes=np.linspace(0.1, 1.0, 5),
        shuffle=True,
        random_state=random_state,
    )

    train_mean = np.mean(train_scores, axis=1)
    validation_mean = np.mean(validation_scores, axis=1)

    plt.figure(figsize=(10, 6))
    plt.plot(train_sizes, train_mean, marker="o", label="Training Macro F1")
    plt.plot(train_sizes, validation_mean, marker="o", label="Validation Macro F1")
    plt.title("Learning Curve - Random Forest")
    plt.xlabel("Training Sample Size")
    plt.ylabel("Macro F1-score")
    plt.ylim(0, 1.05)
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.savefig(figures_dir / "learning_curve.png", dpi=300)
    plt.close()