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
    console.log("Model dimensions:", modelWidth, modelHeight);

    tf.engine().startScope(); // start scoping tf engine
    const [input, xRatio, yRatio] = preprocess(imgSource, modelWidth, modelHeight);
    console.log("Preprocessed input:", input.shape, "xRatio:", xRatio, "yRatio:", yRatio);

    await model.net.executeAsync(input).then((res) => {
        const [boxes, scores, classes] = res.slice(0, 3);
        console.log("Raw model outputs:", { boxes, scores, classes });
        const boxes_data = boxes.dataSync();
        const scores_data = scores.dataSync();
        const classes_data = classes.dataSync();
        console.log("Processed output lengths:", boxes_data.length, scores_data.length, classes_data.length);

        renderBoxes(canvasRef, classThreshold, boxes_data, scores_data, classes_data, [xRatio, yRatio]); // Render bounding boxes
        tf.dispose(res);
    });

    tf.engine.endScope();
};


export const detectVideo = (vidSource, model, classThreshold, canvasRef) => {
    const [modelWidth, modelHeight] = model.inputShape.slice(1, 3);
    console.log("Model input size:", modelWidth, modelHeight);

    const detectFrame = async () => {
        console.log("detectFrame called");

        if (vidSource.videoWidth === 0 && vidSource.srcObject === null) {
            console.log("Video source not ready");
            const ctx = canvasRef.getContext("2d");
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            return;
        }

        tf.engine().startScope();

        const [input, xRatio, yRatio] = preprocess(vidSource, modelWidth, modelHeight);
        console.log("Input tensor shape:", input.shape);

        try {
            const res = await model.net.executeAsync(input);
            console.log("Raw output tensor:", res);

            const output_data = res.dataSync();
            console.log("Output data length:", output_data.length);

            const numDetections = output_data.length / 6; // 6 values per detection
            console.log("Number of detections:", numDetections);

            const boxes = [];
            const scores = [];
            const classes = [];

            for (let i = 0; i < numDetections; i++) {
                const offset = i * 6;
                boxes.push([
                    output_data[offset], 
                    output_data[offset + 1],
                    output_data[offset + 2],
                    output_data[offset + 3],
                ]);
                scores.push(output_data[offset + 4]);
                classes.push(output_data[offset + 5]);
            }

            console.log("First 5 boxes:", boxes.slice(0, 5));
            console.log("First 5 scores:", scores.slice(0, 5));
            console.log("First 5 classes:", classes.slice(0, 5));

            renderBoxes(canvasRef, classThreshold, boxes, scores, classes, [xRatio, yRatio]);
            tf.dispose(res);
        } catch (err) {
            console.error("Error during model execution:", err);
        }

        requestAnimationFrame(detectFrame);
        tf.engine().endScope();
    };

    detectFrame();
};
