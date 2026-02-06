import tensorflow as tf
from tensorflow.keras import layers, models
from pathlib import Path
import json

# PATHS
PROJECT_ROOT = Path(__file__).resolve().parent
DATA_DIR = PROJECT_ROOT / "data"
TRAIN_DIR = DATA_DIR / "train"
TEST_DIR = DATA_DIR / "test"
MODEL_DIR = PROJECT_ROOT / "model"

MODEL_DIR.mkdir(exist_ok=True)

# CONFIG
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
NUM_CLASSES = 9
EPOCHS_WARMUP = 5
EPOCHS_FINETUNE = 8

# LOAD DATA
train_ds = tf.keras.utils.image_dataset_from_directory(
    TRAIN_DIR,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode="categorical",
    shuffle=True
)

test_ds = tf.keras.utils.image_dataset_from_directory(
    TEST_DIR,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode="categorical",
    shuffle=False
)

class_names = train_ds.class_names
print("✅ Classes:", class_names)

# SAVE LABELS
labels = {str(i): name for i, name in enumerate(class_names)}

with open(MODEL_DIR / "labels.json", "w") as f:
    json.dump(labels, f, indent=2)

print("✅ labels.json saved")

# PERFORMANCE
AUTOTUNE = tf.data.AUTOTUNE
train_ds = train_ds.prefetch(AUTOTUNE)
test_ds = test_ds.prefetch(AUTOTUNE)

# DATA AUGMENTATION
data_augmentation = tf.keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.1),
    layers.RandomZoom(0.1),
    layers.RandomContrast(0.1),
])

# BASE MODEL
base_model = tf.keras.applications.EfficientNetB0(
    weights="imagenet",
    include_top=False,
    input_shape=IMG_SIZE + (3,)
)

base_model.trainable = False

# BUILD MODEL
inputs = layers.Input(shape=IMG_SIZE + (3,))
x = data_augmentation(inputs)
x = tf.keras.applications.efficientnet.preprocess_input(x)

x = base_model(x, training=False)
x = layers.GlobalAveragePooling2D()(x)
x = layers.BatchNormalization()(x)
x = layers.Dense(256, activation="relu")(x)
x = layers.Dropout(0.5)(x)

outputs = layers.Dense(NUM_CLASSES, activation="softmax")(x)

model = models.Model(inputs, outputs)

# COMPILE (WARM-UP)
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

print("\n🔹 Training classifier head...")
model.fit(train_ds, epochs=EPOCHS_WARMUP)

# FINE-TUNING
print("\n🔹 Fine-tuning top layers...")

base_model.trainable = True

for layer in base_model.layers[:-20]:
    layer.trainable = False

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

model.fit(train_ds, epochs=EPOCHS_FINETUNE)

# EVALUATION
print("\n🔹 Evaluating on test set...")
model.evaluate(test_ds)

# SAVE MODEL
model_path = MODEL_DIR / "skin_cancer_model.h5"
model.save(model_path)

print(f"\n✅ Model saved at: {model_path}")
