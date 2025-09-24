import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras import layers

model = load_model("best_model.h5")

if not isinstance(model.layers[0], layers.InputLayer):
    inputs = tf.keras.Input(shape=(40, 87, 1), name="input_layer")
    outputs = model(inputs)
    model = tf.keras.Model(inputs=inputs, outputs=outputs)

model.save("bushbuddy_audio.h5")
