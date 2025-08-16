import * as ort from "onnxruntime-web";

// Preprocessing logic
const preprocessVideoFrame = (video) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const MODEL_WIDTH = 500;
    const MODEL_HEIGHT = 500;

    canvas.width = MODEL_WIDTH;
    canvas.height = MODEL_HEIGHT;

    ctx.drawImage(video, 0, 0, MODEL_WIDTH, MODEL_HEIGHT);
    const imageData = ctx.getImageData(0, 0, MODEL_WIDTH, MODEL_HEIGHT);
    const data = imageData.data;

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

const drawBoundingBoxes = (results, video) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // TODO: Loop through detection results and draw rectangles + labels
}