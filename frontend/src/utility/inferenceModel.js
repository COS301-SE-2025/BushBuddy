import * as tf from "@tensorflow/tfjs";

const labels = [
  "Aardvark", "Blue Wildebeest", "Bontebok", "Buffalo", "Bushbuck", "Bushpig",
  "Caracal", "Chacma Baboon", "Cheetah", "Common Warthog", "Duiker", "Eland",
  "Elephant", "Gemsbok", "Giraffe", "Hippo", "Honey Badger", "Hyenah", "Impala",
  "Kudu", "Leopard", "Lion", "Meerkat", "Nyala", "Pangolin", "Red Hartebeest",
  "Rhino", "Rock Hyrax", "SableAntelope", "Serval", "Steenbok", "Vevet Monkey",
  "Waterbuck", "Wild Dog", "Zebra", "springbok"
];

export async function runInference() {
  const model = await tf.loadGraphModel('/model/model.json');
  
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = "/test.jpg"; // 👈 always use test.jpg from public directory
    image.onload = async () => {
      try {
        // Resize the image to 640x640 and normalize
        const tensor = tf.browser.fromPixels(image)
          .resizeBilinear([640, 640])
          .expandDims(0)
          .toFloat()
          .div(tf.scalar(255));

        // Run inference
        console.log("Tensor :" , tensor);
        const output = await model.executeAsync(tensor); 
        console.log("Output :" , output);

        // Postprocess the raw output
        const results = await postprocessYOLO(output, 0.5, 0.45, 36);

        console.log("Inference on test.jpg results:", results);
        resolve(results);
      } catch (err) {
        reject(err);
      }
    };
    image.onerror = reject;
  });
}

async function postprocessYOLO(outputTensor, confThreshold = 0.5, iouThreshold = 0.45) {
  try {
    if (!outputTensor) throw new Error("outputTensor is undefined");

    //console.log("Raw output:", outputTensor);

    // Squeeze batch dimension: [1, 41, 8400] -> [41, 8400]
    let t = outputTensor.squeeze();
    //console.log("After squeeze:", t);

    // Transpose to [8400, 41] so each row is one prediction
    t = t.transpose([1, 0]);
    //console.log("After transpose:", t);

    // Split into [x,y,w,h], obj, class scores
    // Your model = 4 + 1 + 36 = 41
    const [boxXY, boxWH, objectness, classScores] = tf.split(t, [2, 2, 1, 36], -1);
    //console.log("Split tensors:", { boxXY, boxWH, objectness, classScores });

    // Convert xywh → xyxy
    const boxXYWH = tf.concat([boxXY, boxWH], -1); // [8400, 4]
    const boxes = xywhToXyxy(boxXYWH);

    //console.log("Boxes output after xywh → xyxy:" ,boxes);

    // ✅ Apply sigmoid to objectness and class scores
    const obj = tf.sigmoid(objectness);
    const cls = tf.sigmoid(classScores);

    //console.log("After sigmoid: ", {obj, cls});
    // Multiply obj score * class scores
    const scores = obj.mul(cls);

    // Get max score + class per box
    const { values: maxScoresRaw, indices: classIndices } = tf.topk(scores, 1);
    const maxScores = maxScoresRaw.squeeze();          // [8400]
    const classes = classIndices.squeeze();            // [8400]

    // Mask boxes above confidence threshold
    const confMask = maxScores.greater(tf.scalar(confThreshold));
    const confMaskIndices = await tf.whereAsync(confMask);

    if (confMaskIndices.size === 0) {
      console.warn("⚠️ No boxes passed confidence threshold.");
      return { boxes: [], scores: [], classes: [] };
    }

    const idx = confMaskIndices.squeeze();

    // Gather filtered boxes, scores, and classes
    const filteredBoxes = boxes.gather(idx);
    const filteredScores = maxScores.gather(idx);
    const filteredClasses = classes.gather(idx);

    const classNames = filteredClasses.arraySync().map(i => labels[i]);
    console.log("Class names:", classNames);

    // Non-max suppression
    const nmsIndices = await tf.image.nonMaxSuppressionAsync(
      filteredBoxes,
      filteredScores,
      100,
      iouThreshold,
      confThreshold
    );

    // Gather final results
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
  const x2 = x1.add(w);
  const y2 = y1.add(h);
  return tf.concat([x1, y1, x2, y2], -1);
}