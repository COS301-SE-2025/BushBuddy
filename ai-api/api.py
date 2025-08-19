import os
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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load YOLO model at startup
MODEL_PATH = "my_model.pt"
model = YOLO(MODEL_PATH)

class_names = {
    0: 'Aardvark', 1: 'Blue Wildebeest', 2: 'Bontebok', 3: 'Buffalo', 4: 'Bushbuck',
    5: 'Bushpig', 6: 'Caracal', 7: 'Chacma Baboon', 8: 'Cheetah', 9: 'Common Warthog',
    10: 'Duiker', 11: 'Eland', 12: 'Elephant', 13: 'Gemsbok', 14: 'Giraffe',
    15: 'Hippo', 16: 'Honey Badger', 17: 'Hyenah', 18: 'Impala', 19: 'Kudu',
    20: 'Leopard', 21: 'Lion', 22: 'Meerkat', 23: 'Nyala', 24: 'Pangolin',
    25: 'Red Hartebeest', 26: 'Rhino', 27: 'Rock Hyrax', 28: 'SableAntelope', 29: 'Serval',
    30: 'Steenbok', 31: 'Vevet Monkey', 32: 'Waterbuck', 33: 'Wild Dog', 34: 'Wilddog',
    35: 'Zebra', 36: 'springbok'
}

class DetectionRequest(BaseModel):
    image: str 

# Response model
class DetectionResponse(BaseModel):
    detection: Optional[str]  # Animal name or None if no detection
    image: str  # Base64 encoded image with bounding boxes
    confidence: Optional[float]  # Confidence value or None if no detection

# Additional endpoint for multiple detections
class MultiDetectionResponse(BaseModel):
    detections: List[Dict[str, Any]]  # List of all detections
    image: str  # Base64 encoded image with bounding boxes
    count: int  # Number of animals detected

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
            # Normalize to 0-255 range if needed
            if image_rgb.max() <= 1.0:
                image_rgb = (image_rgb * 255).astype(np.uint8)
            else:
                image_rgb = image_rgb.astype(np.uint8)
        
        pil_image = Image.fromarray(image_rgb)
        
        buffer = io.BytesIO()
        pil_image.save(buffer, format='PNG')
        
        # Encode to base64
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
        
        # Draw rectangle
        cv2.rectangle(img_with_boxes, (x1, y1), (x2, y2), (0, 255, 0), 3) 
        
        label = f"{class_name}: {conf:.2f}"
        
        # Calculate font scale based on image size
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
        "message": "Animal Detection API",
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
        
        # Run YOLO inference
        results = model(pil_image)
        
        # Check if any detections were made
        if len(results[0].boxes) == 0:
            if len(np_image.shape) == 3 and np_image.shape[2] == 3:
                np_image_bgr = cv2.cvtColor(np_image, cv2.COLOR_RGB2BGR)
            else:
                np_image_bgr = cv2.cvtColor(np_image, cv2.COLOR_GRAY2BGR)
            
            encoded_image = encode_image_to_base64(np_image_bgr)
            return DetectionResponse(
                detection=None,
                image=encoded_image,
                confidence=None
            )
        
        boxes = []
        class_ids = []
        confidences = []
        
        for box in results[0].boxes:
            boxes.append(box.xyxy[0].cpu().numpy())
            class_ids.append(int(box.cls[0].cpu().numpy()))
            confidences.append(float(box.conf[0].cpu().numpy()))
        
        max_conf_idx = np.argmax(confidences)
        best_class_id = class_ids[max_conf_idx]
        best_confidence = confidences[max_conf_idx]
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
        # Decode the base64 image
        pil_image = decode_base64_image(request.image)
        
        np_image = np.array(pil_image)
        
        # Run YOLO inference
        results = model(pil_image)
        
        detections = []
        boxes = []
        class_ids = []
        confidences = []
        
        for box in results[0].boxes:
            x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
            confidence = float(box.conf[0].cpu().numpy())
            class_id = int(box.cls[0].cpu().numpy())
            class_name = class_names.get(class_id, f'Class_{class_id}')
            
            detections.append({
                "animal": class_name,
                "confidence": confidence,
                "bbox": {
                    "x1": float(x1),
                    "y1": float(y1),
                    "x2": float(x2),
                    "y2": float(y2)
                }
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
            detections=detections,
            image=encoded_image,
            count=len(detections)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)