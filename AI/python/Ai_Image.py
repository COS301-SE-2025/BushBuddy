import os
import sys
import argparse
from ultralytics import YOLO # Import the YOLO class from ultralytics package(need to install ultralytics package)

# Define and parse user input arguments
parser = argparse.ArgumentParser()
parser.add_argument('--model', help='Path to YOLO model file', required=True)
parser.add_argument('--source', help='Image source', required=True)

args = parser.parse_args()

# Parse user inputs
model_path = args.model
img_source = args.source

# Check if model file exists
if not os.path.exists(model_path):
    print('ERROR: Model path is invalid or model was not found.')
    sys.exit(0)

# Load the model
model = YOLO(model_path, task='detect')
labels = model.names

print(f"Model loaded successfully with {len(labels)} classes")
print("Labels:", labels)