import os
import sys
import argparse
import cv2
import numpy as np
from ultralytics import YOLO # Import the YOLO model from ultralytics package(assuming it is installed)

# Define and parse user input arguments
parser = argparse.ArgumentParser()
parser.add_argument('--model', help='Path to YOLO model file', required=True)
parser.add_argument('--source', help='Image source: file, folder, video, or usb camera', required=True)
parser.add_argument('--thresh', help='Minimum confidence threshold', default=0.5)
parser.add_argument('--resolution', help='Resolution in WxH format', default=None)

args = parser.parse_args()

# Parse user inputs
model_path = args.model
img_source = args.source
min_thresh = float(args.thresh)
user_res = args.resolution

# Check if model file exists
if not os.path.exists(model_path):
    print('ERROR: Model path is invalid or model was not found.')
    sys.exit(0)

# Load the model
model = YOLO(model_path, task='detect')
labels = model.names

# Better color scheme for bounding boxes (Tableau 10)
bbox_colors = [(164,120,87), (68,148,228), (93,97,209), (178,182,133), (88,159,106), 
              (96,202,231), (159,124,168), (169,162,241), (98,118,150), (172,176,184)]

# Parse input source type
img_ext_list = ['.jpg','.JPG','.jpeg','.JPEG','.png','.PNG','.bmp','.BMP']
vid_ext_list = ['.avi','.mov','.mp4','.mkv','.wmv']

if os.path.isdir(img_source):
    source_type = 'folder'
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
elif 'usb' in img_source:
    source_type = 'usb'
    usb_idx = int(img_source[3:])
    cap = cv2.VideoCapture(usb_idx)
else:
    print(f'Input {img_source} is invalid.')
    sys.exit(0)

# Parse resolution
resize = False
if user_res:
    resize = True
    resW, resH = int(user_res.split('x')[0]), int(user_res.split('x')[1])
    
    # Set camera resolution if using camera
    if source_type == 'usb':
        cap.set(3, resW)
        cap.set(4, resH)

# FPS tracking variables
frame_rate_buffer = []
fps_avg_len = 50

# Process different source types
if source_type in ['image', 'folder']:
    for img_filename in imgs_list:
        frame = cv2.imread(img_filename)
        if frame is None:
            continue
        
        # Resize frame if needed
        if resize:
            frame = cv2.resize(frame, (resW, resH))
        
        # Run inference
        results = model(frame, verbose=False)
        detections = results[0].boxes
        
        object_count = 0
        
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
                labelSize, baseLine = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
                label_ymin = max(ymin, labelSize[1] + 10)
                cv2.rectangle(frame, (xmin, label_ymin-labelSize[1]-10), (xmin+labelSize[0], label_ymin+baseLine-10), color, cv2.FILLED)
                cv2.putText(frame, label, (xmin, label_ymin-7), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1)
                
                object_count += 1
        
        # Display object count
        cv2.putText(frame, f'Number of objects: {object_count}', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,255,255), 2)
        
        cv2.imshow('YOLO detection results', frame)
        key = cv2.waitKey(0)
        if key == ord('q'):
            break

elif source_type in ['video', 'usb']:
    while True:
        t_start = time.perf_counter()
        
        ret, frame = cap.read()
        if not ret:
            if source_type == 'usb':
                print('Unable to read frames from camera.')
            break
        
        # Resize frame if needed
        if resize:
            frame = cv2.resize(frame, (resW, resH))
        
        # Run inference
        results = model(frame, verbose=False)
        detections = results[0].boxes
        
        object_count = 0
        
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
                labelSize, baseLine = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
                label_ymin = max(ymin, labelSize[1] + 10)
                cv2.rectangle(frame, (xmin, label_ymin-labelSize[1]-10), (xmin+labelSize[0], label_ymin+baseLine-10), color, cv2.FILLED)
                cv2.putText(frame, label, (xmin, label_ymin-7), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1)
                
                object_count += 1
        
        # Calculate FPS
        t_stop = time.perf_counter()
        frame_rate_calc = 1 / (t_stop - t_start)
        frame_rate_buffer.append(frame_rate_calc)
        
        if len(frame_rate_buffer) > fps_avg_len:
            frame_rate_buffer.pop(0)
        
        avg_fps = np.mean(frame_rate_buffer)
        cv2.putText(frame, f'FPS: {avg_fps:.2f}', (10, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,255,255), 2)
        cv2.putText(frame, f'Number of objects: {object_count}', (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,255,255), 2)
        
        cv2.imshow('YOLO detection results', frame)
        key = cv2.waitKey(5)
        if key == ord('q'):
            break
    
    cap.release()

cv2.destroyAllWindows()