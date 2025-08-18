import * as tf from "@tensorflow/tfjs";

// Session is stored here for reuse
let modelSession = null;

/**
 * Load YOLO model from IndexedDB or URL
 */
export async function loadYOLOModel(modelUrl) {
    if (!modelSession) {
        console.log("Loading YOLO model...");
        modelSession = await tf.loadGraphModel(modelUrl);
        console.log("Model loaded into memory");
    }
    return modelSession;
}

/**
 * Run inference on an image or video element
 */
export async function runYOLO(imageElement) {
    if (!modelSession) throw new Error("Model not loaded");

    // Preprocess image: resize, normalize, expand dims
    const inputTensor = tf.browser.fromPixels(imageElement)
        .resizeBilinear([640, 640]) // Ensure model input dims match YOLO
        .expandDims(0)
        .div(255.0);

    // Run inference
    const outputTensors = await modelSession.executeAsync(inputTensor);

    // Parse YOLO outputs
    const results = parseYOLOOutput(outputTensors);

    // Dispose tensors to prevent memory leaks
    tf.dispose([inputTensor, ...outputTensors]);

    return results;
}

/**
 * Parse YOLO output tensor(s) to get boxes, class IDs, and confidence
 * Assumes standard YOLOv5-like output: [batch, num_boxes, 85] where last 4 = box, 1 conf, 80 classes
 */
function parseYOLOOutput(outputTensors) {
    // Usually YOLOv5 TF.js export returns a single tensor: [1, num_boxes, 85]
    const output = outputTensors[0]; // Shape: [1, N, 85]
    const data = output.arraySync()[0]; // Shape: [N, 85]

    const boxes = [];
    const confidenceThreshold = 0.25;

    data.forEach(d => {
        const boxConfidence = d[4]; // objectness score
        const classProbs = d.slice(5); // class probabilities
        const maxClassProb = Math.max(...classProbs);
        const classId = classProbs.indexOf(maxClassProb);
        const confidence = boxConfidence * maxClassProb;

        if (confidence > confidenceThreshold) {
            // YOLO outputs [x_center, y_center, width, height] normalized 0-1
            const x = (d[0] - d[2] / 2) * 640;
            const y = (d[1] - d[3] / 2) * 640;
            const width = d[2] * 640;
            const height = d[3] * 640;

            boxes.push({ x, y, width, height, classId, confidence });
        }
    });

    return boxes;
}

/**
 * Draw bounding boxes and class labels on canvas
 */
export function drawBoxes(canvas, results) {
    if (!canvas || !results) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    results.forEach(box => {
        ctx.strokeStyle = "lime";
        ctx.lineWidth = 2;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        ctx.fillStyle = "lime";
        ctx.font = "16px Arial";
        ctx.fillText(`Class ${box.classId} ${(box.confidence * 100).toFixed(1)}%`, box.x, box.y - 5);
    });
}