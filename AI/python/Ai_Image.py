import os
import sys
import argparse
import cv2
import numpy as np
from ultralytics import YOLO # Import the YOLO model from ultralytics package(assuming it is installed)

# Define and parse user input arguments
parser = argparse.ArgumentParser()
parser.add_argument('--model', help='Path to YOLO model file', required=True)
parser.add_argument('--source', help='Image source: file, folder, or video', required=True)
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

# Parse input source type
img_ext_list = ['.jpg','.JPG','.jpeg','.JPEG','.png','.PNG','.bmp','.BMP']
vid_ext_list = ['.avi','.mov','.mp4','.mkv','.wmv']

if os.path.isdir(img_source):
    source_type = 'folder'
    # Get all image files in folder
    imgs_list = []
    filelist = glob.glob(img_source + '/*')
    for file in filelist:
        _, file_ext = os.path.splitext(file)
        if file_ext in img_ext_list:
            imgs_list.append(file)
elif os.path.isfile(img_source):
    _, ext = os.path.splitext(img_source)
    if ext in img_ext_list:
        source_type = 'image'
        imgs_list = [img_source]
    elif ext in vid_ext_list:
        source_type = 'video'
        cap = cv2.VideoCapture(img_source)
    else:
        print(f'File extension {ext} is not supported.')
        sys.exit(0)
else:
    print(f'Input {img_source} is invalid.')
    sys.exit(0)

# Process images or video
if source_type in ['image', 'folder']:
    for img_filename in imgs_list:
        frame = cv2.imread(img_filename)
        if frame is None:
            continue
        
        # Run inference
        results = model(frame, verbose=False)
        detections = results[0].boxes
        
        # Draw bounding boxes
        for i in range(len(detections)):
            xyxy_tensor = detections[i].xyxy.cpu()
            xyxy = xyxy_tensor.numpy().squeeze()
            xmin, ymin, xmax, ymax = xyxy.astype(int)
            
            classidx = int(detections[i].cls.item())
            classname = labels[classidx]
            conf = detections[i].conf.item()
            
            if conf > min_thresh:
                color = bbox_colors[classidx % len(bbox_colors)]
                cv2.rectangle(frame, (xmin,ymin), (xmax,ymax), color, 2)
                
                label = f'{classname}: {int(conf*100)}%'
                cv2.putText(frame, label, (xmin, ymin-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
        
        cv2.imshow('YOLO detection results', frame)
        key = cv2.waitKey(0)
        if key == ord('q'):
            break

elif source_type == 'video':
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        # Run inference
        results = model(frame, verbose=False)
        detections = results[0].boxes
        
        # Draw bounding boxes
        for i in range(len(detections)):
            xyxy_tensor = detections[i].xyxy.cpu()
            xyxy = xyxy_tensor.numpy().squeeze()
            xmin, ymin, xmax, ymax = xyxy.astype(int)
            
            classidx = int(detections[i].cls.item())
            classname = labels[classidx]
            conf = detections[i].conf.item()
            
            if conf > min_thresh:
                color = bbox_colors[classidx % len(bbox_colors)]
                cv2.rectangle(frame, (xmin,ymin), (xmax,ymax), color, 2)
                
                label = f'{classname}: {int(conf*100)}%'
                cv2.putText(frame, label, (xmin, ymin-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
        
        cv2.imshow('YOLO detection results', frame)
        key = cv2.waitKey(5)
        if key == ord('q'):
            break
    
    cap.release()

cv2.destroyAllWindows()