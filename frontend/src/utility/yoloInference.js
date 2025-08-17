import * as ort from "onnxruntime-web";
import labelsJson from "./labels.json";

/**
 * Letterbox: resize with unchanged aspect ratio and pad (width, height order)
 * Mirrors the Python implementation.
 */
export function letterboxImage(img, newShape = [640, 640], color = [114, 114, 114]) {
  // newShape: [width, height]
  const [newW, newH] = newShape;
  const canvas = document.createElement("canvas");
  canvas.width = newW;
  canvas.height = newH;
  const ctx = canvas.getContext("2d");

  const ratio = Math.min(newW / img.width, newH / img.height);
  const newUnpadW = Math.round(img.width * ratio);
  const newUnpadH = Math.round(img.height * ratio);
  const dw = (newW - newUnpadW) / 2;
  const dh = (newH - newUnpadH) / 2;

  // fill
  ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
  ctx.fillRect(0, 0, newW, newH);

  // draw resized image centered with padding
  ctx.drawImage(img, dw, dh, newUnpadW, newUnpadH);

  return { canvas, ratio, dw, dh, newUnpadW, newUnpadH };
}

/** Convert [x,y,w,h] center format -> [x1,y1,x2,y2] */
function xywh2xyxy(boxes) {
  return boxes.map(([x, y, w, h]) => [
    x - w / 2,
    y - h / 2,
    x + w / 2,
    y + h / 2
  ]);
}

/** Simple NMS (same logic as Python) */
function nmsIndices(boxes, scores, iouThreshold = 0.45) {
  if (!boxes.length) return [];
  const areas = boxes.map(b => Math.max(0, b[2] - b[0]) * Math.max(0, b[3] - b[1]));
  const order = scores
    .map((s, i) => i)
    .sort((a, b) => scores[b] - scores[a]);

  const keep = [];
  let ord = order.slice();
  while (ord.length > 0) {
    const i = ord[0];
    keep.push(i);
    const rest = [];
    for (let k = 1; k < ord.length; k++) {
      const j = ord[k];
      const [x1i, y1i, x2i, y2i] = boxes[i];
      const [x1j, y1j, x2j, y2j] = boxes[j];

      const xx1 = Math.max(x1i, x1j);
      const yy1 = Math.max(y1i, y1j);
      const xx2 = Math.min(x2i, x2j);
      const yy2 = Math.min(y2i, y2j);

      const w = Math.max(0, xx2 - xx1);
      const h = Math.max(0, yy2 - yy1);
      const inter = w * h;
      const ovr = inter / (areas[i] + areas[j] - inter || 1e-8);

      if (ovr <= iouThreshold) rest.push(j);
    }
    ord = rest;
  }
  return keep;
}

/** Safe label getter (works if labels.json is array or object) */
function getLabel(labels, idx) {
  if (Array.isArray(labels)) return labels[idx] ?? String(idx);
  if (labels[idx] !== undefined) return labels[idx];
  if (labels[String(idx)] !== undefined) return labels[String(idx)];
  return String(idx);
}

/**
 * runYOLO(session, base64Image)
 * - session: an onnxruntime-web InferenceSession (created earlier by loadModel)
 * - imageSrc: data URL (base64) from webcamRef.getScreenshot()
 *
 * Returns: { className, confidence, box: [x1,y1,x2,y2] } or null if no detection
 *
 * This follows the same pipeline as your working Python script.
 */
export async function runYOLO(session, imageSrc, options = {}) {
  const confThreshold = options.confThreshold ?? 0.25;
  const iouThreshold = options.iouThreshold ?? 0.45;
  const targetSize = options.targetSize ?? 640; // default same as Python fallback

  if (!session) throw new Error("ONNX session is required");

  // 1) load image from base64 / data URL
  const img = new Image();
  // base64 data URLs don't need crossOrigin, but if you load from a different origin use it.
  img.src = imageSrc;
  await new Promise((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = (e) => reject(new Error("Failed to decode image: " + e?.message));
  });

  // 2) letterbox / pad to target size (width, height)
  const { canvas, ratio, dw, dh } = letterboxImage(img, [targetSize, targetSize]);

  const ctx = canvas.getContext("2d");
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imageData;

  // 3) to Float32Array CHW normalized (0..1)
  const hw = width * height;
  const floatData = new Float32Array(3 * hw);
  for (let i = 0; i < hw; i++) {
    floatData[i] = data[i * 4 + 0] / 255.0; // R
    floatData[i + hw] = data[i * 4 + 1] / 255.0; // G
    floatData[i + 2 * hw] = data[i * 4 + 2] / 255.0; // B
  }

  // 4) create tensor and run session
  const inputName = session.inputNames[0];
  const tensor = new ort.Tensor("float32", floatData, [1, 3, height, width]);

  const feeds = {};
  feeds[inputName] = tensor;

  const results = await session.run(feeds);
  const outputName = session.outputNames[0];
  const outTensor = results[outputName];
  if (!outTensor) throw new Error("Model output not found");

  const outData = outTensor.data; // Float32Array
  const outDims = outTensor.dims; // [1, N, C] expected
  if (!outDims || outDims.length < 3) {
    throw new Error("Unexpected output shape: " + JSON.stringify(outDims));
  }
  const numPredictions = outDims[1];
  const numCols = outDims[2];

  // Expecting each pred: [x, y, w, h, conf, cls] (6) like your Python model.
  if (numCols < 5) {
    throw new Error("Unexpected number of columns per detection: " + numCols);
  }

  // 5) collect detections above threshold
  const boxesXYWH = [];
  const scores = [];
  const classIds = [];

  for (let i = 0; i < numPredictions; i++) {
    const offset = i * numCols;
    const x = outData[offset + 0];
    const y = outData[offset + 1];
    const w = outData[offset + 2];
    const h = outData[offset + 3];
    const conf = outData[offset + 4];
    const cls = numCols >= 6 ? outData[offset + 5] : 0;

    if (conf >= confThreshold) {
      boxesXYWH.push([x, y, w, h]);
      scores.push(conf);
      classIds.push(Math.round(cls));
    }
  }

  if (!boxesXYWH.length) return null;

  // 6) convert to xyxy and NMS
  const xyxy = xywh2xyxy(boxesXYWH);
  const keepIdx = nmsIndices(xyxy, scores, iouThreshold);
  if (!keepIdx.length) return null;

  // pick top (highest score) among kept (keepIdx is ordered by score due to algorithm)
  const topIndex = keepIdx[0];
  const topBox = xyxy[topIndex]; // still in padded/resized coords
  const topScore = scores[topIndex];
  const topClassId = classIds[topIndex];

  // 7) rescale box: remove padding and divide by ratio to map back to original image coords
  // Python did: boxes[:, [0,2]] -= dw ; then boxes /= ratio
  const [x1p, y1p, x2p, y2p] = topBox;
  const x1 = (x1p - dw) / ratio;
  const y1 = (y1p - dh) / ratio;
  const x2 = (x2p - dw) / ratio;
  const y2 = (y2p - dh) / ratio;

  // 8) map to label
  const label = getLabel(labelsJson, topClassId);

  return {
    className: label,
    confidence: topScore,
    box: [Math.round(x1), Math.round(y1), Math.round(x2), Math.round(y2)]
  };
}