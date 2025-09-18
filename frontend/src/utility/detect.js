// detect.js
import * as tf from "@tensorflow/tfjs";
import { renderBoxes } from "./renderBox";
import labels from "./labels.json";

/**
 * Preprocess image into tensor with letterbox padding
 */
async function preprocess(img, modelWidth, modelHeight) {
  console.log("Preprocessing image...");
  let scale, paddingX, paddingY;

  const input = tf.tidy(() => {
    const imgTensor = tf.browser.fromPixels(img);
    const [h, w] = imgTensor.shape.slice(0, 2);

    // Calculate scaling factor
    scale = Math.min(modelWidth / w, modelHeight / h);
    const newW = Math.round(w * scale);
    const newH = Math.round(h * scale);

    paddingX = Math.floor((modelWidth - newW) / 2);
    paddingY = Math.floor((modelHeight - newH) / 2);

    // Resize + pad
    const resized = tf.image.resizeBilinear(imgTensor, [newH, newW]);
    const padded = resized.pad([
      [paddingY, modelHeight - newH - paddingY],
      [paddingX, modelWidth - newW - paddingX],
      [0, 0],
    ]);

    const normalized = padded.div(255.0);
    return normalized.expandDims(0);
  });

  console.log(
    "Preprocessing complete -> input shape:",
    input.shape,
    "scale:",
    scale,
    "paddingX:",
    paddingX,
    "paddingY:",
    paddingY
  );

  return { input, scale, paddingX, paddingY };
}

/**
 * Sigmoid helper
 */
const sigmoid = (x) => 1 / (1 + Math.exp(-x));

/**
 * Convert raw model output to bounding boxes, scores, classes
 */
function postprocess(flatOutput, classThreshold, modelWidth, modelHeight) {
  console.log("Postprocessing raw output...");
  const boxes = [];
  const scores = [];
  const classesArr = [];

  flatOutput.forEach((row) => {
    let [cx, cy, w, h, ...classLogits] = row;

    const maxClassLogit = Math.max(...classLogits);
    const classIndex = classLogits.indexOf(maxClassLogit);

    // Compare the raw logit against the threshold
    if (maxClassLogit > classThreshold) {
      const x1 = Math.max(0, cx - w / 2);
      const y1 = Math.max(0, cy - h / 2);
      const x2 = Math.min(modelWidth, cx + w / 2);
      const y2 = Math.min(modelHeight, cy + h / 2);

      boxes.push([x1, y1, x2, y2]);
      scores.push(maxClassLogit); // Push the raw logit or apply sigmoid here
      classesArr.push(classIndex);
    }
  });

  console.log(
    "Postprocessing complete -> boxes:",
    boxes.length,
    "scores:",
    scores.length,
    "classes:",
    classesArr.length
  );
  return { boxes, scores, classes: classesArr };
}

/**
 * Apply Non-Max Suppression to remove overlapping boxes
 */
async function applyNMS(
  boxes,
  scores,
  classesArr,
  maxOutputSize = 20,
  iouThreshold = 0.3
) {
  console.log("Applying Non-Max Suppression...");
  if (!boxes.length) return { boxes: [], scores: [], classes: [], indices: [] };

  const finalBoxes = [];
  const finalScores = [];
  const finalClasses = [];
  const finalIndices = [];

  const classMap = {};
  classesArr.forEach((cls, i) => {
    if (!classMap[cls]) classMap[cls] = [];
    classMap[cls].push({ box: boxes[i], score: scores[i], index: i });
  });

  for (const cls in classMap) {
    const dets = classMap[cls];
    const boxTensor = tf.tensor2d(dets.map((d) => d.box));
    const scoreTensor = tf.tensor1d(dets.map((d) => d.score));

    const selectedIndices = await tf.image
      .nonMaxSuppressionAsync(boxTensor, scoreTensor, maxOutputSize, iouThreshold)
      .then((t) => t.array());

    selectedIndices.forEach((idx) => {
      const orig = dets[idx].index;
      finalBoxes.push(boxes[orig]);
      finalScores.push(scores[orig]);
      finalClasses.push(classesArr[orig]);
      finalIndices.push(orig);
    });

    boxTensor.dispose();
    scoreTensor.dispose();
  }

  console.log("NMS complete -> boxes:", finalBoxes.length);
  return {
    boxes: finalBoxes,
    scores: finalScores,
    classes: finalClasses,
    indices: finalIndices,
  };
}

/**
 * Main detection function
 */
export async function detectImage(model, classThreshold = 0.25, canvasRef) {
  console.log("Starting detection...");
  const [modelWidth, modelHeight] = model.inputs[0].shape.slice(1, 3);
  console.log("Model input dimensions:", modelWidth, modelHeight);

  const img = new Image();
  img.src = "/test.jpg"; // Public test image
  await new Promise((resolve) => (img.onload = resolve));

  const canvas = canvasRef;
  canvas.width = img.width;
  canvas.height = img.height;

  tf.engine().startScope();

  try {
    // Preprocess
    const { input, scale, paddingX, paddingY } = await preprocess(
      img,
      modelWidth,
      modelHeight
    );
    console.log("Input tensor shape:", input.shape);

    // Run inference
    console.log("Running model inference...");
    const rawOutput = await model.predict(input);
    console.log("Raw output:", rawOutput);
    console.log("Raw output shape:", rawOutput.shape);

    // Convert to flat array
    const outputTensor = tf.tensor(rawOutput.dataSync(), rawOutput.shape);
    const outputTransposed = outputTensor.transpose([0, 2, 1]); // [1, 8400, 46]
    console.log("Output transposed tensor shape:", outputTransposed.shape);

    const flatOutput = outputTransposed.arraySync()[0];
    console.log("FlatOutput first row:", flatOutput[0]);

    // Postprocess
    const { boxes, scores, classes } = postprocess(
      flatOutput,
      classThreshold,
      modelWidth,
      modelHeight
    );

    // Map boxes back to original image space
    const mappedBoxes = boxes.map(([x1, y1, x2, y2]) => [
      (x1 - paddingX) / scale,
      (y1 - paddingY) / scale,
      (x2 - paddingX) / scale,
      (y2 - paddingY) / scale,
    ]);

    console.log("Boxes after mapping back:", mappedBoxes.slice(0, 3));

    // Apply NMS
    const nmsResults = await applyNMS(mappedBoxes, scores, classes);
    console.log("Boxes after NMS:", nmsResults.boxes.length);
    console.log("Sample boxes after NMS:", nmsResults.boxes.slice(0, 3));

    // Render (disabled for now)
    // renderBoxes(canvasRef, classThreshold, nmsResults.boxes.flat(), nmsResults.scores, nmsResults.classes, [img.width, img.height]);

    tf.dispose(input);
    if (Array.isArray(rawOutput)) rawOutput.forEach((t) => t.dispose());
    else rawOutput.dispose();

    console.log("Detection finished.");
    return nmsResults;
  } catch (err) {
    console.error("Error during detection:", err);
    return { boxes: [], scores: [], classes: [] };
  } finally {
    tf.engine().endScope();
  }
}
