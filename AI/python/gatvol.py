import onnxruntime as ort
import numpy as np
from PIL import Image
import json

# ---------------------------
# Helpers
# ---------------------------
def letterbox(im, new_shape=(640, 640), color=(114, 114, 114)):
    """Resize image with unchanged aspect ratio using padding."""
    shape = im.size  # (width, height)
    ratio = min(new_shape[0]/shape[0], new_shape[1]/shape[1])
    new_unpad = (int(shape[0]*ratio), int(shape[1]*ratio))
    dw, dh = new_shape[0]-new_unpad[0], new_shape[1]-new_unpad[1]
    dw /= 2
    dh /= 2
    im = im.resize(new_unpad, Image.BILINEAR)
    new_im = Image.new("RGB", new_shape, color)
    new_im.paste(im, (int(dw), int(dh)))
    return new_im, ratio, dw, dh

def xywh2xyxy(x):
    """Convert [x, y, w, h] to [x1, y1, x2, y2]."""
    y = np.copy(x)
    y[:, 0] = x[:, 0] - x[:, 2]/2  # x1
    y[:, 1] = x[:, 1] - x[:, 3]/2  # y1
    y[:, 2] = x[:, 0] + x[:, 2]/2  # x2
    y[:, 3] = x[:, 1] + x[:, 3]/2  # y2
    return y

def nms(boxes, scores, iou_threshold=0.45):
    """Perform non-max suppression."""
    if len(boxes) == 0:
        return []
    x1, y1, x2, y2 = boxes[:,0], boxes[:,1], boxes[:,2], boxes[:,3]
    areas = (x2 - x1) * (y2 - y1)
    order = scores.argsort()[::-1]
    keep = []
    while order.size > 0:
        i = order[0]
        keep.append(i)
        xx1 = np.maximum(x1[i], x1[order[1:]])
        yy1 = np.maximum(y1[i], y1[order[1:]])
        xx2 = np.minimum(x2[i], x2[order[1:]])
        yy2 = np.minimum(y2[i], y2[order[1:]])
        w = np.maximum(0.0, xx2-xx1)
        h = np.maximum(0.0, yy2-yy1)
        inter = w*h
        ovr = inter / (areas[i] + areas[order[1:]] - inter)
        inds = np.where(ovr <= iou_threshold)[0]
        order = order[inds + 1]
    return keep

# ---------------------------
# Load labels
# ---------------------------
with open("labels.json", "r") as f:
    labels = json.load(f)

# ---------------------------
# Load model
# ---------------------------
session = ort.InferenceSession("my_model.onnx")
input_name = session.get_inputs()[0].name
input_shape = session.get_inputs()[0].shape  # [batch, 3, H, W]

# Handle symbolic dimensions safely
H = input_shape[2] if isinstance(input_shape[2], int) else 640
W = input_shape[3] if isinstance(input_shape[3], int) else 640

# ---------------------------
# Load & preprocess image
# ---------------------------
img = Image.open("test2.jpg").convert("RGB")
img_resized, ratio, dw, dh = letterbox(img, new_shape=(W, H))
img_array = np.array(img_resized).astype(np.float32) / 255.0
img_array = np.transpose(img_array, (2,0,1))[np.newaxis, :, :, :]  # [1,3,H,W]

# ---------------------------
# Inference
# ---------------------------
outputs = session.run(None, {input_name: img_array})[0]  # [1, N, 6]
pred = outputs[0]

# ---------------------------
# Post-processing
# ---------------------------
conf_threshold = 0.25
boxes, scores, class_ids = [], [], []

for det in pred:
    x, y, w, h, conf, cls = det
    if conf < conf_threshold:
        continue
    boxes.append([x, y, w, h])
    scores.append(conf)
    class_ids.append(int(cls))

if boxes:
    boxes = xywh2xyxy(np.array(boxes))
    keep = nms(boxes, np.array(scores))
    boxes = boxes[keep]
    scores = np.array(scores)[keep]
    class_ids = np.array(class_ids)[keep]

    # Rescale to original image
    boxes[:, [0,2]] -= dw
    boxes[:, [1,3]] -= dh
    boxes /= ratio
    boxes = boxes.astype(int)

    for box, score, cls_id in zip(boxes, scores, class_ids):
        label = labels[cls_id]
        print(f"Detected {label} with confidence {score:.2f} at {box}")
else:
    print("No objects detected.")
