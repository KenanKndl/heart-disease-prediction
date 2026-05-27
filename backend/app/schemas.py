from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class PredictRequest(BaseModel):
    signal: List[float] = Field(
        ...,
        description="ECG heartbeat signal values. Expected length is 187.",
    )


class PredictResponse(BaseModel):
    predicted_class: int
    predicted_label: str
    confidence: float
    probabilities: Dict[str, float]
    extracted_features: Dict[str, float]
    selected_feature_count: Optional[int] = None


class SampleResponse(BaseModel):
    signal: List[float]
    true_class: int
    true_label: str


class HealthResponse(BaseModel):
    status: str


class ModelInfoResponse(BaseModel):
    model_name: str
    dataset: str
    approach: Optional[str] = None
    classes: Dict[str, str]
    metrics: Dict[str, float]
    feature_extraction: Dict
    feature_selection: Dict