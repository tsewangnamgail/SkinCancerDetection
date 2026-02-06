from pydantic_settings import BaseSettings
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    # App settings
    APP_NAME: str = "Skin Cancer Detection API"
    DEBUG: bool = True

    # Model paths
    MODEL_PATH: str = str(BASE_DIR / "model" / "skin_cancer_model.h5")
    LABELS_PATH: str = str(BASE_DIR / "model" / "labels.json")
    
    # Database
    DATABASE_URL: str = "sqlite:///./sql_app.db"

    class Config:
        env_file = ".env"


settings = Settings()
