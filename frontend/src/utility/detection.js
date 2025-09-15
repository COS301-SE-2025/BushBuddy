import * as tf from "@tensorflow/tfjs";
import { renderBoxes } from "./renderBox";

const preprocess = (source, modelWidth, modelHeight) => {
    let xRatio, yRatio;

    const input = tf.tidy(() => {
        const img = tf.browser.fromPixels(source);

        // Padding images to squade, in other words, [n, m] -> [n, n]
        const [h, w] = img.shape.slice(0, 2); // Getting source width & height
        const maxSize = Math.max(w, h);
        const imgPadded = img.pad([
            [0, maxSize - h], // Padding bottom only
            [0, maxSize - w], // Padding right only
            [0, 0],
        ]);

        xRatio = maxSize / w; // Updating xration
        yRatio = maxSize / h;

        return tf.image
        .resizeBilinear(imgPadded, [modelWidth, modelHeight]) // resizing frame
        .div(255.0) // normalize
        .expandDims(0);
    });

    return [input, xRatio, yRatio];
};


const sigmoid = (x) => 1 / (1 + Math.exp(-x));

const postprocess = (outputData, resShape, classThreshold) => {
    const numBoxes = resShape[1];
    const numClasses = resShape[2] - 5;

    const boxes = [];
    const scores = [];
    const classes = [];

    for(let i = 0; i < numBoxes; i++){
        const offset = i * (5 + numClasses);

        const x = outputData[offset];
        const y = outputData[offset + 1];
        const w = outputData[offset + 2];
        const h = outputData[offset + 3];
        const objectness = sigmoid(outputData[offset + 4]);

        let bestClass = -1;
        let bestScore = 0;

        for(let c = 0; c < numClasses; c++){
            const classProb = sigmoid(outputData[offset + 5 + c]);
            const score = objectness * classProb;
            if (score > bestScore){
                bestScore = score;
                bestClass = c;
            }
        }

        if( bestScore > classThreshold) {
            const x1 = x - w / 2;
            const y1 = y - h / 2;
            const x2 = x + w / 2;
            const y2 = y + h / 2;

            boxes.push([x1, y1, x2, y2]);
            scores.push(bestScore);
            classes.push(bestClass);
        }
    }

    return { boxes, scores, classes }
}

const applyNMS = async (boxes, scores, maxOutputSize = 100, iouThreshold = 0.5) => {
  if (!boxes.length) return { boxes: [], scores: [], classes: [] };

  const boxesTensor = tf.tensor2d(boxes);
  const scoresTensor = tf.tensor1d(scores);

  const selectedIndices = await tf.image
    .nonMaxSuppressionAsync(boxesTensor, scoresTensor, maxOutputSize, iouThreshold)
    .then((t) => t.array());

  boxesTensor.dispose();
  scoresTensor.dispose();

  const finalBoxes = selectedIndices.map((i) => boxes[i]);
  const finalScores = selectedIndices.map((i) => scores[i]);

  return { boxes: finalBoxes, scores: finalScores, indices: selectedIndices };
};

export const detectImage = async (imgSource, model, classThreshold, canvasRef) => {
    const [modelWidth, modelHeight] = model.inputs[0].shape.slice(1, 3);

    tf.engine().startScope();
    const [input, xRatio, yRatio] = preprocess(imgSource, modelWidth, modelHeight);

    const res = await model.execute(input);
    const outputData = res.dataSync();

    let { boxes, scores, classes } = postprocess(outputData, res.shape, classThreshold);

    const nmsResult = await applyNMS(boxes, scores);
    const finalBoxes = nmsResult.boxes;
    const finalScores = nmsResult.scores;
    const finalClasses = nmsResult.indices.map((i) => classes[i]);

    renderBoxes(canvasRef, classThreshold, finalBoxes.flat(), finalScores, finalClasses, [xRatio, yRatio]);

    tf.dispose(res);
    tf.engine().endScope();
};


export const detectVideo = (vidSource, model, classThreshold, canvasRef) => {
    const [modelWidth, modelHeight] = model.inputs[0].shape.slice(1, 3);
    console.log("Model input size:", modelWidth, modelHeight);

    const detectFrame = async () => {
        console.log("detectFrame called...");

        if( vidSource.videoWidth === 0 || vidSource.videoHeight === 0) {
            requestAnimationFrame(detectFrame)
            return;
        }

        tf.engine().startScope();

        const [input, xRatio, yRatio] = preprocess(vidSource, modelWidth, modelHeight);
        console.log("Input tensor shape:", input.shape);

        try {
            const res = await model.execute(input); // In yolov11. Expected tensor output is [1, N, C]. N is based on 640 x 640 = 8400. C is dependent on the classes count + 5 if im not mistaken
            console.log("Raw output tensor:", res);

            const outputData = res.dataSync();
            console.log("Output data length:", outputData.length);

            let { boxes, scores, classes } = postprocess(outputData, res.shape, classThreshold);
    
            const nmsResult = await applyNMS(boxes, scores);

            boxes = nmsResult.boxes;
            scores = nmsResult.scores;
            classes = nmsResult.indices.map((i) => classes[i]);

            console.log("First 5 boxes:", boxes.slice(0, 5));
            console.log("First 5 scores:", scores.slice(0, 5));
            console.log("First 5 classes:", classes.slice(0, 5));

            renderBoxes(canvasRef, classThreshold, boxes.flat(), scores, classes, [xRatio, yRatio]);
            tf.dispose(res);
        } catch (err) {
            console.error("Error during model execution:", err);
        }

        requestAnimationFrame(detectFrame);
        tf.engine().endScope();
    };

    detectFrame();
};
