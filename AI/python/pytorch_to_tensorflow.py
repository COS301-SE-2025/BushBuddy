from ultralytics import YOLO

PT_MODEL = YOLO("my_model.pt")

# Export PyTorch YOLO model directly to TensorFlow SavedModel
tf_model_path = PT_MODEL.export(format="tfjs")
