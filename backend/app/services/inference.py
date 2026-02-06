import json
import numpy as np
from PIL import Image
from io import BytesIO

from app.core.config import settings

# Lazy-loaded globals
_model = None
_labels = None


def load_model_and_labels():
    global _model, _labels

    if _model is None:
        from tensorflow.keras.models import load_model
        _model = load_model(settings.MODEL_PATH)

    if _labels is None:
        with open(settings.LABELS_PATH, "r") as f:
            _labels = json.load(f)


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    image = Image.open(BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))
    image_array = np.array(image)  # EfficientNet expects [0, 255]
    return np.expand_dims(image_array, axis=0)


async def run_inference(image_file):
    load_model_and_labels()

    image_bytes = await image_file.read()
    processed_image = preprocess_image(image_bytes)

    predictions = _model.predict(processed_image)[0]

    probabilities = {
        _labels[str(i)]: float(predictions[i])
        for i in range(len(predictions))
    }

    predicted_index = int(np.argmax(predictions))

    return {
        "predicted_class": _labels[str(predicted_index)],
        "confidence": float(predictions[predicted_index]),
        "probabilities": probabilities,
    }