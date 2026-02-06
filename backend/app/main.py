from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.predict import router as predict_router

app = FastAPI(title="Skin Cancer Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change later for prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router, prefix="/api")

@app.get("/")
def root():
    return {"status": "Skin Cancer Detection API running"}
