from ultralytics import YOLO

PT_MODEL = YOLO("my_model.pt")
# Export to TensorFlow SavedModel
tf_model_path = PT_MODEL.export(
    format="tf",          # export to TensorFlow SavedModel
    dynamic=False,        # fixes input size, good for predict()
    simplify=True,        # optimize model for inference
)
print("Saved TF model at:", tf_model_path)
