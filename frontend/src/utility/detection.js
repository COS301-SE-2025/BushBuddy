import * as tf from "@tensorflow/tfjs";
import { renderBoxes } from "./renderBox";

const preprocess = (source, modelWidth, modelHeight) => {
    let xRatio, yRatio;

    const input = tf.tidy(() => {
        const img = tf.browser.fromPixels(source);

        // Pad to square
        const [h, w] = img.shape.slice(0, 2);
        const maxSize = Math.max(w, h);
        const imgPadded = img.pad([
            [0, maxSize - h],
            [0, maxSize - w],
            [0, 0],
        ]);

        xRatio = maxSize / w;
        yRatio = maxSize / h;

        return tf.image
            .resizeBilinear(imgPadded, [modelWidth, modelHeight])
            .div(255.0)
            .expandDims(0);
    });

    return [input, xRatio, yRatio];
};

const sigmoid = (x) => 1 / (1 + Math.exp(-x));

export function postprocess(flatOutput, classThreshold, xRatio, yRatio) {
    const boxes = [];
    const scores = [];
    const classes = [];

    flatOutput.forEach((row) => {
        let [x, y, w, h, obj, ...classProbs] = row;

        const objectness = sigmoid(obj);
        const classProbsSigmoid = classProbs.map(sigmoid);
        const bestClassProb = Math.max(...classProbsSigmoid);
        const classIndex = classProbsSigmoid.indexOf(bestClassProb);
        const confidence = objectness * bestClassProb;

        if (confidence > classThreshold) {
            const x1 = (x - w / 2) * xRatio;
            const y1 = (y - h / 2) * yRatio;
            const x2 = (x + w / 2) * xRatio;
            const y2 = (y + h / 2) * yRatio;

            boxes.push([x1, y1, x2, y2]);
            scores.push(confidence);
            classes.push(classIndex);
        }
    });

    console.log("Boxes after filtering:", boxes.length);
    return { boxes, scores, classes };
}

const applyNMS = async (boxes, scores, classes, maxOutputSize = 20, iouThreshold = 0.3) => {
    if (!boxes.length) return { boxes: [], scores: [], classes: [] };

    const classMap = {};
    for (let i = 0; i < classes.length; i++) {
        const cls = classes[i];
        if (!classMap[cls]) classMap[cls] = [];
        classMap[cls].push({ box: boxes[i], score: scores[i], index: i });
    }

    const finalBoxes = [];
    const finalScores = [];
    const finalClasses = [];

    for (const cls in classMap) {
        const classDets = classMap[cls];
        const classBoxes = classDets.map(d => d.box);
        const classScores = classDets.map(d => d.score);

        const boxesTensor = tf.tensor2d(classBoxes);
        const scoresTensor = tf.tensor1d(classScores);

        const selectedIndices = await tf.image
            .nonMaxSuppressionAsync(boxesTensor, scoresTensor, maxOutputSize, iouThreshold)
            .then(t => t.array());

        boxesTensor.dispose();
        scoresTensor.dispose();

        selectedIndices.forEach(idx => {
            const origIdx = classDets[idx].index;
            finalBoxes.push(boxes[origIdx]);
            finalScores.push(scores[origIdx]);
            finalClasses.push(classes[origIdx]);
        });
    }

    console.log("NMS: Total boxes after NMS:", finalBoxes.length);
    return { boxes: finalBoxes, scores: finalScores, classes: finalClasses };
};

export const detectImage = async (model, classThreshold = 0.5, canvasRef) => {
    const [modelWidth, modelHeight] = model.inputs[0].shape.slice(1, 3);
    console.log("Model input dimensions:", modelWidth, modelHeight);

    const canvas = canvasRef;
    const img = new Image();
    img.src = "/test.jpg"; // load test image
    await new Promise(resolve => (img.onload = resolve));

    canvas.width = img.width;
    canvas.height = img.height;

    tf.engine().startScope();

    const [input, xRatio, yRatio] = preprocess(img, modelWidth, modelHeight);
    console.log("Preprocessed input:", input.shape, "xRatio:", xRatio, "yRatio:", yRatio);

    try {
        const res = await model.executeAsync(input); // async preferred
        console.log("Raw output shape:", res.shape);

        // Assuming output shape: [1, channels, numBoxes] => transpose to [numBoxes, channels]
        const outputTensor = tf.tensor(res.dataSync(), res.shape);
        const outputTransposed = outputTensor.transpose([0, 2, 1]);
        const flatOutput = outputTransposed.arraySync()[0];

        outputTensor.dispose();
        outputTransposed.dispose();
        tf.dispose(res);

        console.log("First row of flatOutput:", flatOutput[0]);

        // Postprocess predictions
        const { boxes, scores, classes } = postprocess(flatOutput, classThreshold, xRatio, yRatio);
        console.log("Postprocess results -> boxes:", boxes.length);

        // Apply NMS
        const nmsResult = await applyNMS(boxes, scores, classes);
        console.log("NMS kept:", nmsResult.boxes.length);

        // Render
        renderBoxes(
            canvas,
            classThreshold,
            nmsResult.boxes.flat(),
            nmsResult.scores,
            nmsResult.classes,
            [xRatio, yRatio]
        );
    } catch (err) {
        console.error("Error during model execution:", err);
    }

    tf.engine().endScope();
};



/*export const detectVideo = (vidSource, model, classThreshold = 0.5, canvasRef) => {
    const [modelWidth, modelHeight] = model.inputs[0].shape.slice(1, 3);
    console.log("Model input size:", modelWidth, modelHeight);

    const detectFrame = async () => {
        console.log("detectFrame called...");

        if (vidSource.videoWidth === 0 || vidSource.videoHeight === 0) {
            requestAnimationFrame(detectFrame);
            return;
        }

        const canvas = canvasRef;
        canvas.width = vidSource.videoWidth;
        canvas.height = vidSource.videoHeight;

        tf.engine().startScope();

        const [input, xRatio, yRatio] = preprocess(vidSource, modelWidth, modelHeight);
        console.log("Input tensor shape:", input.shape);

        try {
            const res = await model.execute(input);
            console.log("Raw output tensor:", res);

            const outputData = res.dataSync();
            console.log("First 20 values of output tensor:", outputData.slice(0, 20));
            console.log("Shape of output tensor:", res.shape);

            let { boxes, scores, classes } = postprocess(outputData, res.shape, classThreshold);
    
            const nmsResult = await applyNMS(boxes, scores, classes);

            const finalBoxes = nmsResult.boxes;
            const finalScores = nmsResult.scores;
            const finalClasses = nmsResult.classes;

            console.log("First 5 boxes:", finalBoxes.slice(0, 5));
            console.log("First 5 scores:", finalScores.slice(0, 5));
            console.log("First 5 classes:", finalClasses.slice(0, 5));

            renderBoxes(canvasRef, classThreshold, finalBoxes.flat(), finalScores, finalClasses, [xRatio, yRatio]);
            tf.dispose(res);
        } catch (err) {
            console.error("Error during model execution:", err);
        }

        requestAnimationFrame(detectFrame);
        tf.engine().endScope();
    };

    detectFrame();
};*/