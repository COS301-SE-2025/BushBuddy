import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import Meyda from "meyda";
import './AudioDetect.css';

const AudioDetect = ({
  modelPath = "/audio-model/model.json",
  labels = [
    "Chacma Baboon",
    "Black Wildebeest",
    "Buffalo",
    "Cheetah",
    "Elephant",
    "Hippopotamus",
    "Impala",
    "Lion",
    "Meerkat",
    "White Rhinoceros",
  ],
}) => {
  const [model, setModel] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // new UI states
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const loadedModel = await tf.loadLayersModel(modelPath);
        setModel(loadedModel);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadModel();
  }, [modelPath]);

  const processAudioBlob = async (audioBlob) => {
    try {
      setProcessing(true);
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 22050,
      });
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      const rawData = audioBuffer.getChannelData(0);

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
        setResult({ error: "Could not extract MFCCs. Try another audio file." });
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

      const prediction = model.predict(mfccTensor);
      const probs = prediction.dataSync();
      const bestIdx = probs.indexOf(Math.max(...probs));
      const label = labels[bestIdx];
      const confidence = (probs[bestIdx] * 100).toFixed(2);

      // get the image from the detection result
      const bestiary = JSON.parse(sessionStorage.getItem("bestiary") || "{}");
      const bestiaryArray = Object.values(bestiary);
      const match = bestiaryArray.find(entry => entry.name === label);

      setResult({ label, confidence, image: match?.image_url });


      mfccTensor.dispose();
      prediction.dispose();
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setProcessing(false);
    }
  };

  const handleAudioUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !model) return;
    await processAudioBlob(file);
  };

  const handleVideoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !model) return;

    try {
      setProcessing(true); // show spinner

      const videoEl = document.createElement("video");
      videoEl.src = URL.createObjectURL(file);
      videoEl.muted = true;

      await videoEl.play().catch(() => { });
      const stream = videoEl.captureStream();
      const audioTrack = stream.getAudioTracks()[0];
      if (!audioTrack) {
        setResult({ error: "No audio track found in video." });
        setProcessing(false);
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
      setResult({ error: `Video processing error: ${err.message}` });
      setProcessing(false);
    }
  };


  const startRecording = async () => {
    if (!navigator.mediaDevices) {
      setResult({ error: "Microphone not supported in this browser." });
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

      setTimeout(() => {
        if (mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();
          setRecording(false);
        }
      }, 30000);
    } catch (err) {
      setResult({ error: `Recording error: ${err.message}` });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div className="audio-page">
      <h1>Audio Detection</h1>

      {loading && <p>Loading model...</p>}
      {error && <p>Error: {error}</p>}

      {model && (
        <>
          <p className="instruction-text">Upload audio, video, or record live</p>

          <div className="record-container">
            <button
              onClick={recording ? stopRecording : startRecording}
              className={`record-btn ${recording ? "stop recording" : "start"}`}
            >
              {recording ? "Stop" : "Start"}
            </button>
          </div>

          {audioUrl && (
            <div className="playback-container">
              <p className="playback-text">Recorded Audio:</p>
              <audio controls src={audioUrl}></audio>
            </div>
          )}

          <div className="upload-container">
            <label className="upload-btn">
              Upload Audio
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                style={{ display: "none" }}
              />
            </label>
            <label className="upload-btn">
              Upload Video
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </>
      )}

      {/* Spinner */}
      {processing && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}

      {/* Result Modal */}
      {result && (
        <div className="form-overlay">
          <div className="success-popup">
            <h4>Detection Result</h4>
            {result.error ? (
              <p>{result.error}</p>
            ) : (
              <>
                <p>{result.label}, {result.confidence}%</p>
                {result.image && (
                  <img
                    src={result.image}
                    alt={result.label}
                    className="detection-image"
                  />
                )}
              </>
            )}
            <button
              className="submit-button"
              onClick={() => setResult(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioDetect;
