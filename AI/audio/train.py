# train.py
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models
from sklearn.model_selection import train_test_split
import os

data = np.load("dataset_mfcc.npz")
X = data["X"]         
y = data["y"]
labels = list(data["labels"])

num_classes = len(labels)
input_shape = X.shape[1:] 

X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.15, stratify=y, random_state=42)

y_train_o = tf.keras.utils.to_categorical(y_train, num_classes)
y_val_o = tf.keras.utils.to_categorical(y_val, num_classes)

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
    model = models.Model(inputs=inp, outputs=out)
    return model

model = build_model(input_shape, num_classes)
model.compile(optimizer=tf.keras.optimizers.Adam(1e-3),
              loss='categorical_crossentropy',
              metrics=['accuracy'])

callbacks = [
    tf.keras.callbacks.ModelCheckpoint('best_model.h5', save_best_only=True, monitor='val_accuracy', mode='max'),
    tf.keras.callbacks.EarlyStopping(monitor='val_accuracy', patience=8, restore_best_weights=True)
]

history = model.fit(X_train, y_train_o,
                    validation_data=(X_val, y_val_o),
                    epochs=80,
                    batch_size=32,
                    callbacks=callbacks)

model.save("best_model.h5")
print("Saved best_model.h5")
