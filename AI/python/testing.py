import onnxruntime as ort
import numpy as np
import cv2

# Load your ONNX model
model_path = "my_model.onnx"
session = ort.InferenceSession(model_path)

# Print input/output info
print("Inputs:", [i.name for i in session.get_inputs()])
print("Outputs:", [o.name for o in session.get_outputs()])

# Example: load an image to run inference
image_path = "test.jpg"
img = cv2.imread(image_path)
img = cv2.resize(img, (640, 640))  # match your model input
img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
img = img.astype(np.float32) / 255.0
img = np.transpose(img, (2, 0, 1))  # channels first
img = np.expand_dims(img, axis=0)  # add batch dimension

# Run inference
inputs = {session.get_inputs()[0].name: img}
outputs = session.run(None, inputs)

# Print raw output
print("Model output shape:", [o.shape for o in outputs])
print("First 20 values of output:", outputs[0].flatten()[:20])
