from ultralytics import YOLO
import tensorflowjs as tfjs

PT_MODEL = YOLO("my_model.pt")
NEW_MODEL_NAME =  "model_v0.2"

# Export PyTorch YOLO model directly to TensorFlow SavedModel
tf_model_path = PT_MODEL.export(format="tfjs" )
