from ultralytics import YOLO
import cv2

model = YOLO("my_model.pt")
results = model("test2.jpg", imgsz=500)
result = results[0]

# Draw bounding boxes on the image
annotated_img = result.plot()

# Save to file
cv2.imwrite("annotated_test.jpg", annotated_img)
print("Annotated image saved as annotated_test.jpg")
