from pathlib import Path

import pandas as pd
import yaml
from fastapi import APIRouter, HTTPException

from backend.app.schemas import SampleResponse


PROJECT_ROOT = Path(__file__).resolve().parents[3]

router = APIRouter(prefix="/sample", tags=["Sample"])


def load_config() -> dict:
    config_path = PROJECT_ROOT / "backend" / "config" / "config.yaml"

    with open(config_path, "r", encoding="utf-8") as file:
        return yaml.safe_load(file)


@router.get("", response_model=SampleResponse)
def get_random_sample():
    try:
        config = load_config()

        test_path = PROJECT_ROOT / config["dataset"]["test_path"]
        classes_map = config["classes"]

        if not test_path.exists():
            raise FileNotFoundError(f"Test dataset not found: {test_path}")

        test_df = pd.read_csv(test_path, header=None)

        sample = test_df.sample(n=1).iloc[0]

        signal = sample.iloc[:-1].astype(float).tolist()
        true_class = int(sample.iloc[-1])
        true_label = classes_map[str(true_class)]

        return {
            "signal": signal,
            "true_class": true_class,
            "true_label": true_label,
        }

    except FileNotFoundError as error:
        raise HTTPException(status_code=500, detail=str(error))
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Sample loading failed: {str(error)}")