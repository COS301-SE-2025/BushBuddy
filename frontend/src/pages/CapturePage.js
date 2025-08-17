import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Container } from 'react-bootstrap';
import { loadModel } from '../utility/modelStorageOperations';
import './CapturePage.css';
import { preprocessVideoFrame, postprocessYOLO, drawBoundingBoxes } from "../utility/yoloInference";
import annotationLabels from "../utility/labels.json";

const CapturePage = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [session, setSession] = useState(null);
  const [loadingModel, setLoadingModel] = useState(true);
  const [paused, setPaused] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: { ideal: "environment" },
  };

  useEffect(() => {
    const init = async () => {
      try {
        const modelSession = await loadModel();
        setSession(modelSession);
        console.log("Detection Model Ready...");
      } catch (err) {
        console.error("Error loading model:", err);
      } finally {
        setLoadingModel(false);
      }
    };
    init();
  }, []);

  // Live detection loop
  useEffect(() => {
    if (!session) return;

    let animationFrameID;

    const detectFrame = async () => {
      if (!paused) { // Only run detection if not paused
        if (
          webcamRef.current &&
          webcamRef.current.video &&
          webcamRef.current.video.readyState === 4
        ) {
          const video = webcamRef.current.video;

          const tensor = preprocessVideoFrame(video);
          const results = await session.run({ images: tensor });
          const output = results[Object.keys(results)[0]];
          const detections = postprocessYOLO(output, annotationLabels, 0.5);

          if (canvasRef.current) {
            drawBoundingBoxes(detections, canvasRef.current, video);
          }
        }
      }
      animationFrameID = requestAnimationFrame(detectFrame);
    };

    detectFrame();
    return () => cancelAnimationFrame(animationFrameID);
  }, [session, paused]);

  const captureImage = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      console.log("Captured Image:", imageSrc);
      setCapturedImage(imageSrc);
      setPaused(true); // Pause the detection loop
    }
  };

  const resumeDetection = () => {
    setCapturedImage(null);
    setPaused(false); // Resume detection
  };

  return (
    <Container className="scanner-page">
      <Container className="webcam-wrapper">
        <Webcam
          ref={webcamRef}
          className="webcam"
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          mirrored={false}
          screenshotQuality={1}
          forceScreenshotSourceSize
        />
        <canvas
          ref={canvasRef}
          className="overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
        <div className="capture-button-wrapper">
          {!capturedImage ? (
            <button className="capture-button" onClick={captureImage}>
              Capture
            </button>
          ) : (
            <div className="image-preview-actions">
              <img src={capturedImage} alt="Captured" className="preview-image"/>
              <button onClick={resumeDetection}>Resume Detection</button>
              {/* Add any other actions for the captured image here */}
            </div>
          )}
        </div>
      </Container>
    </Container>
  );
};

export default CapturePage;
