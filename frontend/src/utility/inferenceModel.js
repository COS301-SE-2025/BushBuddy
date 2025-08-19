import * as tf from "@tensorflow/tfjs";

const labels = [
  "Aardvark", "Blue Wildebeest", "Bontebok", "Buffalo", "Bushbuck", "Bushpig",
  "Caracal", "Chacma Baboon", "Cheetah", "Common Warthog", "Duiker", "Eland",
  "Elephant", "Gemsbok", "Giraffe", "Hippo", "Honey Badger", "Hyenah", "Impala",
  "Kudu", "Leopard", "Lion", "Meerkat", "Nyala", "Pangolin", "Red Hartebeest",
  "Rhino", "Rock Hyrax", "SableAntelope", "Serval", "Steenbok", "Vervet Monkey",
  "Waterbuck", "Wild Dog", "Zebra", "Springbok"
];
function letterboxImage(img, targetWidth=640, targetHeight=640) {
  const [h, w] = [img.height, img.width];
  const scale = Math.min(targetWidth / w, targetHeight / h);
  const newWidth = Math.round(w * scale);
  const newHeight = Math.round(h * scale);

  // Resize while keeping aspect ratio
  let tensor = tf.browser.fromPixels(img)
    .resizeBilinear([newHeight, newWidth])
    .toFloat()
    .div(tf.scalar(255));

  // Compute padding
  const padX = targetWidth - newWidth;
  const padY = targetHeight - newHeight;
  const padLeft = Math.floor(padX / 2);
  const padRight = padX - padLeft;
  const padTop = Math.floor(padY / 2);
  const padBottom = padY - padTop;

  // Pad with zeros (black)
  tensor = tensor.pad([[padTop, padBottom], [padLeft, padRight], [0, 0]]);

  // Add batch dimension
  return tensor.expandDims(0);
}
export async function runInference() {
  const model = await tf.loadGraphModel("/model/model.json");

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = "/test.jpg";
    image.crossOrigin = "anonymous"; // Avoid CORS issues

    image.onload = async () => {
      try {
        const tensor = letterboxImage(image);

        console.log("Original image size:", image.width, image.height);
        console.log("Tensor shape:", tensor.shape);

        const output = await model.executeAsync(tensor);

        // Some models return an array, some return a single tensor
        const outputTensor = Array.isArray(output) ? output[0] : output;

        const results = await postprocessYOLO(outputTensor, 0.2, 0.45, labels.length);
        console.log("Final inference results:", results);
        resolve(results);
      } catch (err) {
        console.error("Error during inference:", err);
        reject(err);
      }
    };

    image.onerror = (err) => reject(err);
  });
}

async function postprocessYOLO(outputTensor, confThreshold = 0.5, iouThreshold = 0.45, numClasses = 36) {
  try {
    if (!outputTensor) throw new Error("outputTensor is undefined");

    // [1, 41, 8400] → [41, 8400] → [8400, 41]
    const t = outputTensor.squeeze().transpose([1, 0]);

    const [boxXY, boxWH, objectness, classScores] = tf.split(t, [2, 2, 1, numClasses], -1);

    const boxes = xywhToXyxy(tf.concat([boxXY, boxWH], -1));

    const obj = tf.sigmoid(objectness);
    const cls = tf.sigmoid(classScores);

    const scores = obj.mul(cls);

    const { values: maxScoresRaw, indices: classIndices } = tf.topk(scores, 1);
    const maxScores = maxScoresRaw.squeeze();
    const classes = classIndices.squeeze();

    const confMask = maxScores.greater(tf.scalar(confThreshold));
    const confMaskIndices = await tf.whereAsync(confMask);

    if (confMaskIndices.shape[0] === 0) {
      console.warn("⚠️ No boxes passed confidence threshold.");
      return { boxes: [], scores: [], classes: [] };
    }

    const idx = confMaskIndices.squeeze();

    const filteredBoxes = boxes.gather(idx);
    const filteredScores = maxScores.gather(idx);
    const filteredClasses = classes.gather(idx);

    // TFJS NMS expects boxes in [y1, x1, y2, x2]
    const nmsIndices = await tf.image.nonMaxSuppressionAsync(
      filteredBoxes,
      filteredScores,
      100,
      iouThreshold,
      confThreshold
    );

    return {
      boxes: await filteredBoxes.gather(nmsIndices).array(),
      scores: await filteredScores.gather(nmsIndices).array(),
      classes: await filteredClasses.gather(nmsIndices).array()
    };
  } catch (err) {
    console.error("❌ Error in postprocessYOLO:", err);
    return { boxes: [], scores: [], classes: [] };
  }
}

function xywhToXyxy(boxes) {
  const [x, y, w, h] = tf.split(boxes, 4, -1);
  const x1 = x.sub(w.div(2));
  const y1 = y.sub(h.div(2));
  const x2 = x.add(w.div(2));
  const y2 = y.add(h.div(2));
  // Reorder to [y1, x1, y2, x2] for TFJS NMS
  return tf.concat([y1, x1, y2, x2], -1);
}
