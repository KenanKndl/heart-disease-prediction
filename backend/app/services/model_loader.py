import json
from pathlib import Path

import joblib
import yaml


PROJECT_ROOT = Path(__file__).resolve().parents[3]


class ModelArtifacts:
    def __init__(self):
        self.config = self._load_config()

        self.model_path = PROJECT_ROOT / self.config["model"]["model_path"]
        self.scaler_path = PROJECT_ROOT / self.config["model"]["scaler_path"]
        self.selector_path = PROJECT_ROOT / self.config["model"]["selector_path"]
        self.metadata_path = PROJECT_ROOT / self.config["model"]["metadata_path"]

        self.model = None
        self.scaler = None
        self.selector = None
        self.metadata = None

    def _load_config(self) -> dict:
        config_path = PROJECT_ROOT / "backend" / "config" / "config.yaml"

        if not config_path.exists():
            raise FileNotFoundError(f"Config file not found: {config_path}")

        with open(config_path, "r", encoding="utf-8") as file:
            return yaml.safe_load(file)

    def load(self):
        if not self.model_path.exists():
            raise FileNotFoundError(f"Model file not found: {self.model_path}")

        if not self.scaler_path.exists():
            raise FileNotFoundError(f"Scaler file not found: {self.scaler_path}")

        if not self.selector_path.exists():
            raise FileNotFoundError(f"Selector file not found: {self.selector_path}")

        if not self.metadata_path.exists():
            raise FileNotFoundError(f"Metadata file not found: {self.metadata_path}")

        self.model = joblib.load(self.model_path)
        self.scaler = joblib.load(self.scaler_path)
        self.selector = joblib.load(self.selector_path)

        with open(self.metadata_path, "r", encoding="utf-8") as file:
            self.metadata = json.load(file)

        return self


model_artifacts = ModelArtifacts()