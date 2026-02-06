import json
import numpy as np
from PIL import Image
from io import BytesIO

from app.core.config import settings
from tensorflow.keras.applications.efficientnet import preprocess_input
from tensorflow.keras.models import load_model

# Lazy-loaded globals
_model = None
_labels = None


def load_model_and_labels():
    global _model, _labels

    if _model is None:
        print("Loading model from:", settings.MODEL_PATH)
        _model = load_model(settings.MODEL_PATH)

    if _labels is None:
        with open(settings.LABELS_PATH, "r") as f:
            _labels = json.load(f)
        print("Loaded labels:", _labels)


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    image = Image.open(BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))

    image_array = np.array(image).astype("float32")
    image_array = np.expand_dims(image_array, axis=0)

    # MUST match training
    image_array = preprocess_input(image_array)

    return image_array


async def run_inference(image_file):
    load_model_and_labels()

    image_bytes = await image_file.read()
    processed_image = preprocess_image(image_bytes)

    predictions = _model.predict(processed_image, verbose=0)[0]

    print("Raw predictions:", predictions)

    predicted_index = int(np.argmax(predictions))

    probabilities = {
        _labels[str(i)]: float(predictions[i])
        for i in range(len(predictions))
    }

    return {
        "predicted_class": _labels[str(predicted_index)],
        "confidence": float(predictions[predicted_index]),
        "probabilities": probabilities,
    }
