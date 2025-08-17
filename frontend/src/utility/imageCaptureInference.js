// src/utility/imageCaptureInference.js
import * as ort from "onnxruntime-web";
import labels from "./labels.json"; // keep this JSON next to this file

// Resize + normalize a base64 image into an ONNX tensor [1,3,640,640] float32
async function preprocessImage(imageSrc) {
  const MODEL_W = 640;
  const MODEL_H = 640;

  // 1) Load base64 into an <img>
  const img = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = imageSrc;
  });

  // 2) Draw to a canvas (simple resize; fine since we’re not drawing boxes yet)
  const canvas = document.createElement("canvas");
  canvas.width = MODEL_W;
  canvas.height = MODEL_H;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, MODEL_W, MODEL_H);

  // 3) Convert to CHW float32 (0..1)
  const { data } = ctx.getImageData(0, 0, MODEL_W, MODEL_H);
  const chw = new Float32Array(1 * 3 * MODEL_H * MODEL_W);

  // CHW layout: [R(0..), G(...), B(...)]
  const planeSize = MODEL_W * MODEL_H;
  for (let y = 0; y < MODEL_H; y++) {
    for (let x = 0; x < MODEL_W; x++) {
      const i = (y * MODEL_W + x) * 4; // RGBA
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;

      const p = y * MODEL_W + x;
      chw[p] = r;
      chw[planeSize + p] = g;
      chw[2 * planeSize + p] = b;
    }
  }

  return new ort.Tensor("float32", chw, [1, 3, MODEL_H, MODEL_W]);
}

// YOLOv5 ONNX (channel-first) postprocess for output shape: [1, C, N]
// where C = 5 + numClasses, N = number of anchors (e.g., 8400)
function postprocess(outputTensor, confThresh = 0.5, iouThresh = 0.45) {
  const preds = outputTensor.data;       // Float32Array
  const [b, c, n] = outputTensor.dims;   // e.g., [1, 41, 8400]
  const numClasses = labels.length;
  const expectedC = 5 + numClasses;

  if (c !== expectedC) {
    console.warn(`Unexpected channel count. Got ${c}, expected ${expectedC} (5 + ${numClasses} classes).`);
  }

  // Utility
  const sigmoid = (x) => 1 / (1 + Math.exp(-x));

  const dets = [];
  for (let i = 0; i < n; i++) {
    // channel-first indexing: val = preds[channel * n + i]
    const cx = preds[0 * n + i];
    const cy = preds[1 * n + i];
    const w  = preds[2 * n + i];
    const h  = preds[3 * n + i];

    const objLogit = preds[4 * n + i];
    const obj = sigmoid(objLogit);

    // find best class
    let bestScore = -Infinity;
    let bestIdx = -1;
    for (let cls = 0; cls < numClasses; cls++) {
      const logit = preds[(5 + cls) * n + i];
      const p = sigmoid(logit);
      const score = obj * p;
      if (score > bestScore) {
        bestScore = score;
        bestIdx = cls;
      }
    }

    if (bestScore >= confThresh && bestIdx >= 0) {
      const x1 = cx - w / 2;
      const y1 = cy - h / 2;
      const x2 = cx + w / 2;
      const y2 = cy + h / 2;
      dets.push({
        x1, y1, x2, y2,
        label: labels[bestIdx],
        confidence: bestScore,
      });
    }
  }

  // NMS
  dets.sort((a, b) => b.confidence - a.confidence);
  const keep = [];
  while (dets.length) {
    const a = dets.shift();
    keep.push(a);
    dets = dets.filter((b) => {
      const xx1 = Math.max(a.x1, b.x1);
      const yy1 = Math.max(a.y1, b.y1);
      const xx2 = Math.min(a.x2, b.x2);
      const yy2 = Math.min(a.y2, b.y2);
      const w = Math.max(0, xx2 - xx1);
      const h = Math.max(0, yy2 - yy1);
      const inter = w * h;
      const areaA = Math.max(0, (a.x2 - a.x1)) * Math.max(0, (a.y2 - a.y1));
      const areaB = Math.max(0, (b.x2 - b.x1)) * Math.max(0, (b.y2 - b.y1));
      const iou = inter / (areaA + areaB - inter);
      return iou < iouThresh;
    });
  }

  return keep;
}

/**
 * High-level API: take a base64 image, run ONNX YOLO, return detections + the image
 * @param {string} imageSrc - base64 screenshot from <Webcam>.getScreenshot()
 * @param {ort.InferenceSession} session
 * @returns {Promise<{detections: Array, image: string}>}
 */
export async function runImageInference(imageSrc, session) {
  try {
    const tensor = await preprocessImage(imageSrc);
    const outputs = await session.run({ images: tensor });
    const output = outputs[Object.keys(outputs)[0]];
    const detections = postprocess(output, 0.5, 0.45);
    return { detections, image: imageSrc };
  } catch (err) {
    console.error("runImageInference error:", err);
    return { detections: [], image: imageSrc };
  }
}

