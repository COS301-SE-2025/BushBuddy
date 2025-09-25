import React, { useState, useEffect, useRef } from "react";
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

  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Load model on mount
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

  // Shared function to process audio (file or blob)
  const processAudioBlob = async (audioBlob) => {
    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 22050,
      });
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      const rawData = audioBuffer.getChannelData(0);

      // Frame & MFCC extraction
      const frameSize = 1024;
      const hopSize = 512;
      let mfccs = [];

      Meyda.sampleRate = 22050;
      Meyda.bufferSize = frameSize;
      Meyda.melBands = 40;
      Meyda.numberOfMFCCCoefficients = 40;

      for (let i = 0; i + frameSize <= rawData.length; i += hopSize) {
        const frame = rawData.slice(i, i + frameSize);
        const features = Meyda.extract(["mfcc"], frame);
        if (features && features.mfcc) mfccs.push(features.mfcc);
      }

      if (mfccs.length === 0) {
        alert("Could not extract MFCCs. Try another audio file.");
        return;
      }

      let mfccTensor = tf.tensor2d(mfccs).transpose();

      const EXPECTED_FRAMES = 87;
      if (mfccTensor.shape[1] < EXPECTED_FRAMES) {
        const padAmount = EXPECTED_FRAMES - mfccTensor.shape[1];
        mfccTensor = tf.pad(mfccTensor, [[0, 0], [0, padAmount]]);
      } else if (mfccTensor.shape[1] > EXPECTED_FRAMES) {
        mfccTensor = mfccTensor.slice([0, 0], [40, EXPECTED_FRAMES]);
      }

      mfccTensor = mfccTensor.expandDims(-1).expandDims(0);

      // Predict
      const prediction = model.predict(mfccTensor);
      const probs = prediction.dataSync();
      const bestIdx = probs.indexOf(Math.max(...probs));
      const label = labels[bestIdx];
      const confidence = (probs[bestIdx] * 100).toFixed(2);

      // Debug: top 3
      const sortedProbs = probs
        .map((prob, idx) => ({
          label: labels[idx],
          confidence: (prob * 100).toFixed(2),
        }))
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3);

      console.log("Top 3 predictions:", sortedProbs);
      alert(`${label}, ${confidence}%`);

      mfccTensor.dispose();
      prediction.dispose();
    } catch (err) {
      console.error("Audio processing error:", err);
      alert(`Error: ${err.message}`);
    }
  };

  // Handle file upload (audio)
  const handleAudioUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !model) return;
    await processAudioBlob(file);
  };

  // Handle video upload -> extract audio
  const handleVideoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !model) return;

    try {
      const videoEl = document.createElement("video");
      videoEl.src = URL.createObjectURL(file);
      videoEl.muted = true;

      await videoEl.play().catch(() => {}); // ensure metadata loads
      const stream = videoEl.captureStream();
      const audioTrack = stream.getAudioTracks()[0];

      if (!audioTrack) {
        alert("No audio track found in this video.");
        return;
      }

      const audioStream = new MediaStream([audioTrack]);
      const mediaRecorder = new MediaRecorder(audioStream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        await processAudioBlob(audioBlob);
      };

      mediaRecorder.start();
      videoEl.onended = () => {
        if (mediaRecorder.state !== "inactive") mediaRecorder.stop();
      };
    } catch (err) {
      console.error("Video processing error:", err);
      alert(`Video processing error: ${err.message}`);
    }
  };

  // Recording logic
  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Microphone not supported in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      chunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(audioBlob));
        if (model) await processAudioBlob(audioBlob);
      };

      mediaRecorder.start();
      setRecording(true);

      // Auto-stop after 30s
      setTimeout(() => {
        if (mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();
          setRecording(false);
        }
      }, 30000);
    } catch (err) {
      console.error("Recording error:", err);
      alert(`Recording error: ${err.message}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">BuddyScanner - Audio Detection</h1>

      {loading && <p>Loading model...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      {model && (
        <>
          <p className="text-green-600">Upload audio, video, or record live</p>

          {/* Audio upload */}
          <input
            type="file"
            accept="audio/*"
            onChange={handleAudioUpload}
            className="mt-4 block"
          />

          {/* Video upload */}
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="mt-4 block"
          />

          <div className="mt-4">
            {!recording ? (
              <button
                onClick={startRecording}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Start Recording (30s max)
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Stop Recording
              </button>
            )}
          </div>

          {audioUrl && (
            <div className="mt-4">
              <p className="font-semibold">Recorded Audio (debug playback):</p>
              <audio controls src={audioUrl}></audio>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AudioDetect;
