import os
# Set environment variables before importing OpenCV-dependent libraries
os.environ['OPENCV_IO_ENABLE_OPENEXR'] = '0'

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ultralytics import YOLO
from PIL import Image
import numpy as np
import base64
import io
from typing import Optional, List, Dict, Any
import cv2
import uvicorn

app = FastAPI(title="BushBuddy AI API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001",
        "https://bushbuddy-dev.onrender.com",
        "https://bush-buddy.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

# Load YOLO model at startup
MODEL_PATH = "my_model.pt"
model = YOLO(MODEL_PATH)

class_names = {
    0: 'Aardvark', 1: 'African Wild Cat', 2: 'African Wild Dog', 3: 'Background',
    4: 'Black Rhino', 5: 'Black Wildebeest', 6: 'Blesbok', 7: 'Blue Wildebeest',
    8: 'Brown Hyena', 9: 'Buffalo', 10: 'Bushbuck', 11: 'Bushpig', 12: 'Caracal',
    13: 'Chacma Baboon', 14: 'Cheetah', 15: 'Common Warthog', 16: 'Duiker',
    17: 'Eland', 18: 'Elephant', 19: 'Gemsbok', 20: 'Giraffe', 21: 'Greater Kudu',
    22: 'Hippopotamus', 23: 'Honey Badger', 24: 'Impala', 25: 'Leopard',
    26: 'Lesser Kudu', 27: 'Lion', 28: 'Meerkat', 29: 'Nyala', 30: 'Pangolin',
    31: 'Plains Zebra', 32: 'Red Hartebeest', 33: 'Rock Hyrax',
    34: 'Sable Antelope', 35: 'Serval', 36: 'Spotted Hyena', 37: 'Springbok',
    38: 'Steenbok', 39: 'Vervet Monkey', 40: 'Waterbuck', 41: 'White Rhino'
}

class DetectionRequest(BaseModel):
    image: str 

class DetectionResponse(BaseModel):
    detection: Optional[str]
    image: str
    confidence: Optional[float]

class MultiDetectionResponse(BaseModel):
    detections: List[Dict[str, Any]]
    image: str
    count: int

def decode_base64_image(base64_string: str) -> Image.Image:
    try:
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        image_data = base64.b64decode(base64_string)
        image = Image.open(io.BytesIO(image_data))
        
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        return image
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image data: {str(e)}")

def encode_image_to_base64(image: np.ndarray, input_format='BGR') -> str:
    try:
        if len(image.shape) == 3 and image.shape[2] == 3:
            if input_format.upper() == 'BGR':
                image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            else:
                image_rgb = image
        else:
            image_rgb = image
        
        if image_rgb.dtype != np.uint8:
            if image_rgb.max() <= 1.0:
                image_rgb = (image_rgb * 255).astype(np.uint8)
            else:
                image_rgb = image_rgb.astype(np.uint8)
        
        pil_image = Image.fromarray(image_rgb)
        buffer = io.BytesIO()
        pil_image.save(buffer, format='PNG')
        image_bytes = buffer.getvalue()
        base64_string = base64.b64encode(image_bytes).decode('utf-8')
        return base64_string
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error encoding image: {str(e)}")

def draw_bounding_boxes(image: np.ndarray, boxes, class_ids, confidences) -> np.ndarray:
    if len(image.shape) == 3 and image.shape[2] == 3:
        img_with_boxes = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    else:
        img_with_boxes = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
    
    for box, class_id, conf in zip(boxes, class_ids, confidences):
        x1, y1, x2, y2 = map(int, box)
        class_name = class_names.get(int(class_id), f'Class_{int(class_id)}')
        
        cv2.rectangle(img_with_boxes, (x1, y1), (x2, y2), (0, 255, 0), 3) 
        label = f"{class_name}: {conf:.2f}"
        
        font_scale = max(0.8, min(1.5, image.shape[1] / 1000))
        font_thickness = max(2, int(image.shape[1] / 500)) 
        
        (text_width, text_height), baseline = cv2.getTextSize(
            label, cv2.FONT_HERSHEY_SIMPLEX, font_scale, font_thickness
        )
        
        cv2.rectangle(img_with_boxes, 
                     (x1, y1 - text_height - 10), 
                     (x1 + text_width, y1), 
                     (0, 255, 0), -1)
        cv2.putText(img_with_boxes, label, 
                   (x1, y1 - 5), 
                   cv2.FONT_HERSHEY_SIMPLEX, 
                   font_scale, (0, 0, 0), font_thickness)
    
    return img_with_boxes

@app.get("/")
async def root():
    return {
        "message": "BushBuddy AI API",
        "endpoints": {
            "/detect": "POST - Detect animals in image",
            "/detect_all": "POST - Detect all animals in image",
            "/health": "GET - Health check",
            "/docs": "GET - API documentation"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

@app.post("/detect", response_model=DetectionResponse)
async def detect_animals(request: DetectionRequest):
    try:
        pil_image = decode_base64_image(request.image)
        np_image = np.array(pil_image)
        results = model(pil_image)
        
        if len(results[0].boxes) == 0:
            if len(np_image.shape) == 3 and np_image.shape[2] == 3:
                np_image_bgr = cv2.cvtColor(np_image, cv2.COLOR_RGB2BGR)
            else:
                np_image_bgr = cv2.cvtColor(np_image, cv2.COLOR_GRAY2BGR)
            
            encoded_image = encode_image_to_base64(np_image_bgr)
            return DetectionResponse(
                detection="No animals detected",
                image=encoded_image,
                confidence=0.0
            )
        
        boxes, class_ids, confidences = [], [], []
        for box in results[0].boxes:
            boxes.append(box.xyxy[0].cpu().numpy())
            class_ids.append(int(box.cls[0].cpu().numpy()))
            confidences.append(float(box.conf[0].cpu().numpy()))
        
        max_conf_idx = np.argmax(confidences)
        best_class_id = class_ids[max_conf_idx]
        best_confidence = confidences[max_conf_idx]

        # Handle background as no detection
        if best_class_id == 3:
            if len(np_image.shape) == 3 and np_image.shape[2] == 3:
                np_image_bgr = cv2.cvtColor(np_image, cv2.COLOR_RGB2BGR)
            else:
                np_image_bgr = cv2.cvtColor(np_image, cv2.COLOR_GRAY2BGR)

            encoded_image = encode_image_to_base64(np_image_bgr)
            return DetectionResponse(
                detection="No animals detected",
                image=encoded_image,
                confidence=0.0
            )

        best_class_name = class_names.get(best_class_id, f'Class_{best_class_id}')
        img_with_boxes = draw_bounding_boxes(np_image, boxes, class_ids, confidences)
        encoded_image = encode_image_to_base64(img_with_boxes)

        return DetectionResponse(
            detection=best_class_name,
            image=encoded_image,
            confidence=best_confidence
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")

@app.post("/detect_all", response_model=MultiDetectionResponse)
async def detect_all_animals(request: DetectionRequest):
    try:
        pil_image = decode_base64_image(request.image)
        np_image = np.array(pil_image)
        results = model(pil_image)
        
        detections, boxes, class_ids, confidences = [], [], [], []
        
        for box in results[0].boxes:
            class_id = int(box.cls[0].cpu().numpy())
            if class_id == 3:  # skip background
                continue

            x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
            confidence = float(box.conf[0].cpu().numpy())
            class_name = class_names.get(class_id, f'Class_{class_id}')
            
            detections.append({
                "animal": class_name,
                "confidence": confidence,
                "bbox": {"x1": float(x1), "y1": float(y1), "x2": float(x2), "y2": float(y2)}
            })
            boxes.append([x1, y1, x2, y2])
            class_ids.append(class_id)
            confidences.append(confidence)
        
        if detections:
            img_with_boxes = draw_bounding_boxes(np_image, boxes, class_ids, confidences)
        else:
            if len(np_image.shape) == 3 and np_image.shape[2] == 3:
                img_with_boxes = cv2.cvtColor(np_image, cv2.COLOR_RGB2BGR)
            else:
                img_with_boxes = cv2.cvtColor(np_image, cv2.COLOR_GRAY2BGR)

            encoded_image = encode_image_to_base64(img_with_boxes)
            return MultiDetectionResponse(
                detections=[{"animal": "No animals detected", "confidence": 0.0, "bbox": None}],
                image=encoded_image,
                count=0
            )
        
        encoded_image = encode_image_to_base64(img_with_boxes)
        return MultiDetectionResponse(
            detections=detections,
            image=encoded_image,
            count=len(detections)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)
