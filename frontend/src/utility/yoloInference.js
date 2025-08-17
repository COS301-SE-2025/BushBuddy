import * as ort from "onnxruntime-web";

// Preprocessing logic
export const preprocessVideoFrame = (video) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const MODEL_WIDTH = 640;
    const MODEL_HEIGHT = 640;

    canvas.width = MODEL_WIDTH;
    canvas.height = MODEL_HEIGHT;

    // draw curr vid frame on hidden canvas
    ctx.drawImage(video, 0, 0, MODEL_WIDTH, MODEL_HEIGHT);
    const imageData = ctx.getImageData(0, 0, MODEL_WIDTH, MODEL_HEIGHT);
    const data = imageData.data;

    // convert to Float32Array CHW and normalize 
    const tensorData = new Float32Array(1 * 3 * MODEL_HEIGHT * MODEL_WIDTH);
    for( let y = 0; y < MODEL_HEIGHT; y++) {
        for(let x = 0; x < MODEL_WIDTH; x++){
            const i = (y * MODEL_WIDTH + x) * 4;
            const r = data[i] / 255;
            const g = data[i + 1] / 255;
            const b = data[i + 2] / 255;

            tensorData[y * MODEL_WIDTH + x] = r;
            tensorData[ MODEL_HEIGHT * MODEL_WIDTH + y * MODEL_WIDTH + x] = g;
            tensorData[2 * MODEL_HEIGHT * MODEL_WIDTH + y * MODEL_WIDTH + x] = b;
        }
    }

    return new ort.Tensor("float32", tensorData, [1, 3, MODEL_HEIGHT, MODEL_WIDTH]);
};

export const postprocessYOLO = (output, labels, confidenceThreshold = 0.3, iouThreshold = 0.45) => {
    const preds = output.data;
    const [batch, numChannels, numPreds] = output.dims; // e.g., [1, 41, 8400]

    const numClasses = numChannels - 5; // 4 bbox + 1 objectness + numClasses
    const detections = [];

    // transpose from [C, N] to [N, C]
    for (let i = 0; i < numPreds; i++) {
        const offset = i;
        const x = preds[offset];
        const y = preds[offset + numPreds];
        const w = preds[offset + 2 * numPreds];
        const h = preds[offset + 3 * numPreds];
        const objectness = preds[offset + 4 * numPreds];

        const classProbs = [];
        for (let c = 0; c < numClasses; c++) {
            classProbs.push(preds[offset + (5 + c) * numPreds]);
        }

        const classIdx = classProbs.indexOf(Math.max(...classProbs));
        const conf = objectness * classProbs[classIdx];

        if (conf > confidenceThreshold) {
            detections.push({
                x1: x - w / 2,
                y1: y - h / 2,
                x2: x + w / 2,
                y2: y + h / 2,
                label: labels[classIdx] || `Class ${classIdx}`,
                confidence: conf,
            });
        }
    }

    return nonMaxSuppression(detections, iouThreshold);
};

const nonMaxSuppression = (boxes, iouThreshold = 0.45) => {
  boxes.sort((a, b) => b.confidence - a.confidence);
  const keep = [];

  while (boxes.length) {
    const current = boxes.shift();
    keep.push(current);

    boxes = boxes.filter((b) => {
      const xx1 = Math.max(current.x1, b.x1);
      const yy1 = Math.max(current.y1, b.y1);
      const xx2 = Math.min(current.x2, b.x2);
      const yy2 = Math.min(current.y2, b.y2);

      const w = Math.max(0, xx2 - xx1);
      const h = Math.max(0, yy2 - yy1);
      const inter = w * h;
      const areaB = (b.x2 - b.x1) * (b.y2 - b.y1);
      const areaA = (current.x2 - current.x1) * (current.y2 - current.y1);

      const iou = inter / (areaA + areaB - inter);
      return iou < iouThreshold;
    });
  }

  return keep;
};

export const drawBoundingBoxes = (detections, canvas, video) => {
  const ctx = canvas.getContext("2d");
  const vw = video.videoWidth;
  const vh = video.videoHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 2;
  ctx.font = "16px Arial";
  ctx.textBaseline = "top";

  detections.forEach((d, i) => {
    const color = `hsl(${(i * 50) % 360}, 100%, 50%)`;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    const scaleX = vw / 640;
    const scaleY = vh / 640;
    const x = d.x1 * scaleX;
    const y = d.y1 * scaleY;
    const w = (d.x2 - d.x1) * scaleX;
    const h = (d.y2 - d.y1) * scaleY;

    ctx.strokeRect(x, y, w, h);
    ctx.fillText(`${d.label} ${(d.confidence * 100).toFixed(0)}%`, x, y);
  });
};