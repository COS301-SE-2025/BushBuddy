// Globals from CDN: `tf` and `Meyda`

const MODEL_URL = './model/model.json';
const LABELS = ['elephant','lion','hyena']; // same order as training labels

let model;

async function loadModel() {
  model = await tf.loadLayersModel(MODEL_URL);
  // Warmup with dummy input: shape [1, 40, 87, 1]
  await model.predict(tf.zeros([1, 40, 87, 1]));
  console.log('✅ Model loaded and warmed up');
}
loadModel();

document.getElementById('start').addEventListener('click', async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioCtx = new AudioContext();
  const source = audioCtx.createMediaStreamSource(stream);

  const bufferSize = 1024;
  const mfccHistory = [];

  const meydaAnalyzer = Meyda.createMeydaAnalyzer({
    audioContext: audioCtx,
    source: source,
    bufferSize: bufferSize,
    featureExtractors: ['mfcc'],
    numberOfMFCCCoefficients: 40,
    callback: features => {
      if (!features || !features.mfcc) return;

      mfccHistory.push(features.mfcc);

      const EXPECTED_FRAMES = 87;
      if (mfccHistory.length >= EXPECTED_FRAMES) {
        // Flatten into Float32Array [frames, coeffs]
        const arr = new Float32Array(40 * EXPECTED_FRAMES);
        for (let f = 0; f < EXPECTED_FRAMES; f++) {
          const frame = mfccHistory[f];
          for (let m = 0; m < 40; m++) {
            arr[f * 40 + m] = frame[m];
          }
        }

        // Tensor shape: [1, 40, frames, 1]
        const input = tf.tensor(arr, [EXPECTED_FRAMES, 40])
          .transpose()     // (40, frames)
          .expandDims(0)   // (1, 40, frames)
          .expandDims(-1); // (1, 40, frames, 1)

        const pred = model.predict(input);
        const scores = pred.arraySync()[0];
        const maxI = scores.indexOf(Math.max(...scores));

        document.getElementById('label').innerText =
          `${LABELS[maxI]} (${(scores[maxI] * 100).toFixed(1)}%)`;

        mfccHistory.shift();
        tf.dispose([input, pred]);
      }
    }
  });

  meydaAnalyzer.start();
});
