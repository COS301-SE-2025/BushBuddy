import * as ort from "onnxruntime-web";

// Preprocessing logic
const preprocessVideoFrame = (video) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const MODEL_WIDTH = 500;
    const MODEL_HEIGHT = 500;

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

const postprocessYOLO = (output, labels, confidenceThreshold = 0.5, iouThreshold = 0.45) => {
    const preds = output.data;
    const numDetections = preds.length / 85;
    const detections = [];

    for (let i = 0; i < numDetections; i++) {
        const offset = i * 85;
        const x = preds[offset];
        const y = preds[offset + 1];
        const w = preds[offset + 2];
        const h = preds[offset + 3];
        const objectness = preds[offset + 4];

        const classProbs = preds.slice(offset + 5, offset + 85);
        const classIdx = classProbs.indexOf(Math.max(...classProbs));
        const conf = objectness * classProbs[classIdx];

        if (conf > confidenceThreshold) {
            detections.push({
                x1: x - w / 2,
                y1: y - h / 2,
                x2: x + w / 2,
                y2: y + h / 2,
                label: labels[classIdx],
                confidence: conf,
            });
        }
    }

    // apply nms
    return nonMaxSuppresion(detections, iouThreshold);
}


const drawBoundingBoxes = (results, video) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // TODO: Loop through detection results and draw rectangles + labels
}