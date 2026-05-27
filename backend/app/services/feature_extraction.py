import numpy as np
import pandas as pd
from scipy.signal import find_peaks
from scipy.stats import skew, kurtosis


FEATURE_NAMES = [
    "mean",
    "std",
    "min",
    "max",
    "median",
    "range",
    "energy",
    "rms",
    "skewness",
    "kurtosis",
    "zero_crossing_rate",
    "peak_count",
    "peak_mean",
    "peak_max",
    "signal_area",
    "first_half_mean",
    "second_half_mean",
    "half_mean_difference",
]


def extract_features_from_signal(signal: np.ndarray) -> dict:
    """
    Extracts statistical, energy-based and peak-based features from a single ECG heartbeat signal.

    Parameters
    ----------
    signal : np.ndarray
        One ECG heartbeat signal. Expected shape: (187,)

    Returns
    -------
    dict
        Extracted feature dictionary.
    """

    signal = np.asarray(signal, dtype=float)

    if signal.ndim != 1:
        raise ValueError("Signal must be a 1-dimensional array.")

    if len(signal) == 0:
        raise ValueError("Signal cannot be empty.")

    first_half = signal[: len(signal) // 2]
    second_half = signal[len(signal) // 2 :]

    peaks, _ = find_peaks(signal)

    if len(peaks) > 0:
        peak_values = signal[peaks]
        peak_mean = float(np.mean(peak_values))
        peak_max = float(np.max(peak_values))
    else:
        peak_mean = 0.0
        peak_max = 0.0

    zero_crossings = np.diff(np.signbit(signal - np.mean(signal)))

    features = {
        "mean": float(np.mean(signal)),
        "std": float(np.std(signal)),
        "min": float(np.min(signal)),
        "max": float(np.max(signal)),
        "median": float(np.median(signal)),
        "range": float(np.max(signal) - np.min(signal)),
        "energy": float(np.sum(signal ** 2)),
        "rms": float(np.sqrt(np.mean(signal ** 2))),
        "skewness": float(skew(signal)),
        "kurtosis": float(kurtosis(signal)),
        "zero_crossing_rate": float(np.mean(zero_crossings)),
        "peak_count": int(len(peaks)),
        "peak_mean": peak_mean,
        "peak_max": peak_max,
        "signal_area": float(np.trapezoid(signal)),
        "first_half_mean": float(np.mean(first_half)),
        "second_half_mean": float(np.mean(second_half)),
        "half_mean_difference": float(np.mean(first_half) - np.mean(second_half)),
    }

    return features


def extract_features_from_dataframe(signals: pd.DataFrame) -> pd.DataFrame:
    """
    Extracts features from all ECG signals in a dataframe.

    Parameters
    ----------
    signals : pd.DataFrame
        DataFrame containing raw ECG signal values.

    Returns
    -------
    pd.DataFrame
        DataFrame containing extracted features.
    """

    feature_rows = []

    for _, row in signals.iterrows():
        features = extract_features_from_signal(row.values)
        feature_rows.append(features)

    return pd.DataFrame(feature_rows, columns=FEATURE_NAMES)