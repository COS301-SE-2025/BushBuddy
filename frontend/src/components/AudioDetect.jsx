import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Meyda from "meyda";

const AudioDetect = ({
  modelPath = "/audio-model/model.json",
  labels = [
    "baboon",
    "black_wildebeest",
    "buffalo",
    "cheetah",
    "elephant",
    "hippo",
    "impala",
    "lion",
    "meerkat",
    "rhino",
  ],
}) => {
  const [model, setModel] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        console.log("TensorFlow.js backend:", tf.getBackend());

        const loadedModel = await tf.loadLayersModel(modelPath);
        setModel(loadedModel);

        console.log("Model loaded successfully");
        console.log("Inputs:", loadedModel.inputs);
        console.log("Outputs:", loadedModel.outputs);
      } catch (err) {
        console.error("Model load error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadModel();
  }, [modelPath]);

  const handleAudioUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !model) return;

    try {
      // Load and resample to 22050 Hz
      const arrayBuffer = await file.arrayBuffer();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 22050,
      });
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      const rawData = audioBuffer.getChannelData(0);

      // FIXED: Use n_fft=1024 to match training
      const frameSize = 1024;  // Changed from 512
      const hopSize = 512;
      let mfccs = [];

      Meyda.sampleRate = 22050;
      Meyda.bufferSize = frameSize;  // Now 1024
      Meyda.melBands = 40;
      Meyda.numberOfMFCCCoefficients = 40;

      for (let i = 0; i + frameSize <= rawData.length; i += hopSize) {
        const frame = rawData.slice(i, i + frameSize);
        const features = Meyda.extract(["mfcc"], frame);

        if (features && features.mfcc) {
          mfccs.push(features.mfcc);
        }
      }

      if (mfccs.length === 0) {
        alert("Could not extract MFCCs. Try another audio file.");
        return;
      }

      // Shape: [timeFrames, 40] → transpose to [40, timeFrames]
      let mfccTensor = tf.tensor2d(mfccs).transpose();

      // Pad or truncate to 87 frames
      const EXPECTED_FRAMES = 87;
      if (mfccTensor.shape[1] < EXPECTED_FRAMES) {
        const padAmount = EXPECTED_FRAMES - mfccTensor.shape[1];
        mfccTensor = tf.pad(mfccTensor, [
          [0, 0],
          [0, padAmount],
        ]);
      } else if (mfccTensor.shape[1] > EXPECTED_FRAMES) {
        mfccTensor = mfccTensor.slice([0, 0], [40, EXPECTED_FRAMES]);
      }

      // CRITICAL FIX: Add feature normalization
      // Normalize each MFCC coefficient (along time axis)
      // const mean = tf.mean(mfccTensor, axis = 1, keepDims = true);
      // const variance = tf.moments(mfccTensor, axes = 1, keepDims = true).variance;
      // const std = tf.sqrt(variance.add(1e-8)); // Add small epsilon for numerical stability
      // mfccTensor = mfccTensor.sub(mean).div(std);

      // Final shape: [1, 40, 87, 1]
      mfccTensor = mfccTensor.expandDims(-1).expandDims(0);

      // Predict
      const prediction = model.predict(mfccTensor);
      const probs = prediction.dataSync();
      const bestIdx = probs.indexOf(Math.max(...probs));
      const label = labels[bestIdx];
      const confidence = (probs[bestIdx] * 100).toFixed(2);

      // Show top 3 predictions for debugging
      const sortedProbs = probs
        .map((prob, idx) => ({ label: labels[idx], confidence: (prob * 100).toFixed(2) }))
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3);

      // Clean up tensors
      mfccTensor.dispose();
      prediction.dispose();
      // mean.dispose();
      // variance.dispose();
      // std.dispose();

    } catch (err) {
      console.error("Audio processing error:", err);
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">🦁 Wildlife Audio Classifier</h1>

      {loading && <p>Loading model...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      {model && (
        <>
          <p className="text-green-600">✅ Model ready</p>
          <input
            type="file"
            accept="audio/*"
            onChange={handleAudioUpload}
            className="mt-4"
          />
        </>
      )}
    </div>
  );
};

export default AudioDetect;
