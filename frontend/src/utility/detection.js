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


export const detectImage = async (imgSource, model, classThreshold, canvasRef) => {
    const [modelWidth, modelHeight] = model.inputShape.slice(1, 3); // Get model width and height

    tf.engine().startScope(); // start scoping tf engine
    const [input, xRatio, yRatio] = preprocess(imgSource, modelWidth, modelHeight);

    await model.net.executeAsync(input).then((res) => {
        const [boxes, scores, classes] = res.slice(0, 3);
        const boxes_data = boxes.dataSync();
        const scores_data = scores.dataSync();
        const classes_data = classes.dataSync();
        renderBoxes(canvasRef, classThreshold. boxes_data, scores_data, classes_data, [xRatio, yRatio]); // Render bounding boxes
        tf.dispose(res);
    });

    tf.engine.endScope();
};


