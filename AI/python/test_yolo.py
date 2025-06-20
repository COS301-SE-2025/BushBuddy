from ultralytics import YOLO

model = YOLO("yolov5s.pt")  # Loads pre-trained YOLOv5s model
results = model.predict("https://ultralytics.com/images/bus.jpg")  # Test inference
print(results[0].boxes.xyxy)  # Print detected bounding boxes