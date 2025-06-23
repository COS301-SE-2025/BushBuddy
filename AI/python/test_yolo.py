from ultralytics import YOLO

try:
    model = YOLO("yolov5su.pt")
except FileNotFoundError:
    print("Local model not found, downloading...")
    model = YOLO("yolov5su.pt")
try:
    results = model.predict("bus.jpg")
except FileNotFoundError:
    print("Local image not found, downloading...")
    results = model.predict("https://ultralytics.com/images/bus.jpg")

print(results[0].boxes.xyxy)
