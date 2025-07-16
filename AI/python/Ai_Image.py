import os
import sys
import argparse
from ultralytics import YOLO # Import the YOLO class from ultralytics package(need to install ultralytics package)

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

# Check if source is a single image file
if os.path.isfile(img_source):
    frame = cv2.imread(img_source)
    if frame is None:
        print('ERROR: Could not load image')
        sys.exit(0)
    
    # Run inference
    results = model(frame, verbose=False)
    detections = results[0].boxes
    
    print(f"Found {len(detections)} detections")
    
    # Display the image
    cv2.imshow('YOLO detection results', frame)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
else:
    print('ERROR: Source must be an image file')
    sys.exit(0)