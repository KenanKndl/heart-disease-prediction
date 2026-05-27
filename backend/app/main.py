from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.routes.model_info import router as model_info_router
from backend.app.routes.predict import router as predict_router
from backend.app.routes.sample import router as sample_router
from backend.app.schemas import HealthResponse
from backend.app.services.model_loader import model_artifacts


app = FastAPI(
    title="ECG Heartbeat Classification API",
    description="FastAPI backend for ECG heartbeat classification using feature extraction, feature selection and Random Forest.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    model_artifacts.load()


@app.get("/health", response_model=HealthResponse)
def health_check():
    return {"status": "ok"}


app.include_router(model_info_router)
app.include_router(sample_router)
app.include_router(predict_router)