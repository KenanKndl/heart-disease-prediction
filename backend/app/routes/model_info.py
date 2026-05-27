from fastapi import APIRouter, HTTPException

from backend.app.schemas import ModelInfoResponse
from backend.app.services.model_loader import model_artifacts


router = APIRouter(prefix="/model-info", tags=["Model Info"])


@router.get("", response_model=ModelInfoResponse)
def get_model_info():
    try:
        if model_artifacts.metadata is None:
            model_artifacts.load()

        metadata = model_artifacts.metadata

        return {
            "model_name": metadata["model_name"],
            "dataset": metadata["dataset"],
            "approach": metadata.get("approach"),
            "classes": metadata["classes"],
            "metrics": metadata["metrics"],
            "feature_extraction": metadata["feature_extraction"],
            "feature_selection": metadata["feature_selection"],
        }

    except FileNotFoundError as error:
        raise HTTPException(status_code=500, detail=str(error))
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Model info failed: {str(error)}")