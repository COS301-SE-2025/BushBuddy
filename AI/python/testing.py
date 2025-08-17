import json
from ultralytics import YOLO

# Load labels.json
with open("labels.json", "r") as f:
    labels = json.load(f)

# Convert from {"0": "Impala", "1": "Greater Kudu", ...} to list
id2label = labels

# Load model
model = YOLO("my_model.onnx")  # or your exported model path

# Run inference on a test image
results = model("test.jpg")  # replace with your test image

# Print detected animals
for result in results:
    boxes = result.boxes
    for box in boxes:
        cls_id = int(box.cls[0])        # class index
        conf = float(box.conf[0])       # confidence
        label = id2label[cls_id]        # map to animal name
        print(f"Detected {label} with confidence {conf:.2f}")

'''from ultralytics import YOLO

# Load your trained YOLOv5/YOLOv8 model
model = YOLO("my_model.pt")

# Run inference on an image
results = model.predict("test.jpg", imgsz=640)  # returns processed results

# Export to ONNX (with NMS baked in)
model.export(format="onnx", opset=17, simplify=True, dynamic=True, nms=True)'''

'''from ultralytics import YOLO
import json
'''
'''# Load your YOLO model
model = YOLO("my_model.pt")

# Get class names
labels = [model.names[i] for i in range(len(model.names))]

# Save to labels.json
with open("labels.json", "w") as f:
    json.dump(labels, f, indent=2)

print("Saved labels.json with", len(labels), "classes.")'''
