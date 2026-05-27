from fastapi import APIRouter, HTTPException

from backend.app.schemas import PredictRequest, PredictResponse
from backend.app.services.prediction_service import predict_single


router = APIRouter(prefix="/predict", tags=["Prediction"])


@router.post("", response_model=PredictResponse)
def predict(request: PredictRequest):
    try:
        result = predict_single(request.signal)
        return result
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))
    except FileNotFoundError as error:
        raise HTTPException(status_code=500, detail=str(error))
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(error)}")