from fastapi import APIRouter, UploadFile, File, HTTPException

from app.schemas.prediction import PredictionResponse
from app.services.inference import run_inference

router = APIRouter()


@router.post("/predict", response_model=PredictionResponse)
async def predict_skin_cancer(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload an image."
        )

    try:
        result = await run_inference(file)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
