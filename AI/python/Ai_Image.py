import os
import sys
import argparse
import cv2
import numpy as np
from ultralytics import YOLO # Import the YOLO model from ultralytics package(assuming it is installed)

# Define and parse user input arguments
parser = argparse.ArgumentParser()
parser.add_argument('--model', help='Path to YOLO model file', required=True)
parser.add_argument('--source', help='Image source', required=True)
parser.add_argument('--thresh', help='Minimum confidence threshold', default=0.5)

args = parser.parse_args()

# Parse user inputs
model_path = args.model
img_source = args.source
min_thresh = float(args.thresh)

# Check if model file exists
if not os.path.exists(model_path):
    print('ERROR: Model path is invalid or model was not found.')
    sys.exit(0)

# Load the model
model = YOLO(model_path, task='detect')
labels = model.names

# Simple color scheme for bounding boxes
bbox_colors = [(0,255,0), (255,0,0), (0,0,255), (255,255,0), (255,0,255)]

# Check if source is a single image file
if os.path.isfile(img_source):
    frame = cv2.imread(img_source)
    if frame is None:
        print('ERROR: Could not load image')
        sys.exit(0)
    
    # Run inference
    results = model(frame, verbose=False)
    detections = results[0].boxes
    
    # Draw bounding boxes
    for i in range(len(detections)):
        # Get bounding box coordinates
        xyxy_tensor = detections[i].xyxy.cpu()
        xyxy = xyxy_tensor.numpy().squeeze()
        xmin, ymin, xmax, ymax = xyxy.astype(int)
        
        # Get class and confidence
        classidx = int(detections[i].cls.item())
        classname = labels[classidx]
        conf = detections[i].conf.item()
        
        # Draw if confidence is high enough
        if conf > min_thresh:
            color = bbox_colors[classidx % len(bbox_colors)]
            cv2.rectangle(frame, (xmin,ymin), (xmax,ymax), color, 2)
            
            label = f'{classname}: {int(conf*100)}%'
            cv2.putText(frame, label, (xmin, ymin-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
    
    # Display the image
    cv2.imshow('YOLO detection results', frame)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
else:
    print('ERROR: Source must be an image file')
    sys.exit(0)