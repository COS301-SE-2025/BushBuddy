import tensorflow as tf
from tensorflow.keras import layers, models

# Rebuild architecture
def build_model(input_shape, num_classes):
    inp = layers.Input(shape=input_shape)
    x = layers.Conv2D(32, (3,3), activation='relu', padding='same')(inp)
    x = layers.BatchNormalization()(x)
    x = layers.MaxPooling2D((2,2))(x)

    x = layers.Conv2D(64, (3,3), activation='relu', padding='same')(x)
    x = layers.BatchNormalization()(x)
    x = layers.MaxPooling2D((2,2))(x)

    x = layers.Conv2D(128, (3,3), activation='relu', padding='same')(x)
    x = layers.BatchNormalization()(x)
    x = layers.GlobalAveragePooling2D()(x)

    x = layers.Dropout(0.3)(x)
    out = layers.Dense(num_classes, activation='softmax')(x)
    return models.Model(inputs=inp, outputs=out)

# ✅ Load dataset metadata (for input_shape & num_classes)
import numpy as np
data = np.load("dataset_mfcc.npz")
X = data["X"]
labels = list(data["labels"])

input_shape = X.shape[1:]  # same as training
num_classes = len(labels)

# Rebuild model and load weights
model = build_model(input_shape, num_classes)
model.load_weights("bushbuddy_audio.h5")  # your weights-only file

# Save as a *full model* with architecture + weights + config
model.save("bushbuddy_full_model.h5")
print("Full model saved as bushbuddy_full_model.h5")
