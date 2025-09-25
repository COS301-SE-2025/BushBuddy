import React, { useRef, useState, useEffect } from "react";
import Webcam from 'react-webcam';
import { Container } from 'react-bootstrap';
import './CapturePage.css';
import { detectImage } from "../utility/detect";
import * as tf from "@tensorflow/tfjs";
import { loadModel } from "../utility/modelStorageOperations";


 //-- Mock data
import axios from 'axios';

var animalName = "None";
var confidence = "None";


const CapturePage = () => {
  const [model, setModel] = useState(null);
  useEffect(() => {
    async function initModel() {
      const m = await loadModel();
      setModel(m);
    }
    initModel();
  }, []);


  const overlayRef = useRef(null);
  const webcamRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [showPopup, setShowPopup] = useState(false);


  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);


  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: { ideal: "environment" },
  };

  /*useEffect( () => {
    if(model && webcamRef.current?.video && overlayRef.current) {
      detectVideo(webcamRef.current.video, model, 0.3, overlayRef.current); // Remember, 4 parameters are -> vidSource, AI model, classThreshold, canvas Reference
    }
  },[model]);*/

  async function toBase64(input) {  //just for testing
    // If it's already a File or Blob
    if (input instanceof File || input instanceof Blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(input);
        reader.onload = () => resolve(reader.result.split(",")[1]); // clean base64
        reader.onerror = (error) => reject(error);
      });
    }

    if (typeof input === "string") {
      const response = await fetch(input); // must be in /public folder
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => resolve(reader.result.split(",")[1]); // clean base64
        reader.onerror = (error) => reject(error);
      });
    }

    throw new Error("Unsupported input type for toBase64");
  }

  const captureImage = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc || !model) return;

    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      // Call an async function here
      runDetection(img, canvas);
    };

    /* ------- API AI model
    // Capture the image from webcam
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    console.log("Captured Image (data URL):", imageSrc);
    setCapturedImage(imageSrc);

    // Convert to clean Base64 (remove "data:image/jpeg;base64," header)
    const base64Image = imageSrc.split(",")[1];

    // Show spinner
    setLoading(true);

    try {
      const response = await axios.post(
        // "http://localhost:7860/detect",
        "https://RuanEsterhuizen-BushBuddy.hf.space/detect",
        { image: base64Image },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Prediction result:", response.data);

      let animalName = response.data.detection;
      let confidence = response.data.confidence;

      setApiResponse(response.data);

      if (animalName == null) {
        animalName = "No animals found";
        confidence = "";
      }

      setShowForm(true);

    } catch (err) {
      console.error("API request failed:", err);
    } finally {
      setLoading(false);
    }*/
  };

  const runDetection = async (img, canvas) => {
    try {
      const results = await detectImage(model, 0.25, canvas, img);

      console.log("Detection results CapturePage: ", results);

      setCapturedImage(img.src);
      animalName = results.labels[0];
      confidence = results.scores[0];
      setShowForm(true);
    } catch (err) {
      console.error("Error during detection:", err);
    }
  };

  const handleClose = () => setShowForm(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    console.log("Form submitted with data:", {
      postName: formData.get('postName'),
      description: formData.get('description'),
      geolocation: formData.get('geolocation') === 'on'
    });

    setShowForm(false);
    setShowPopup(true);
  };

  return (
    <Container className="scanner-page">
      {loading && <div className="spinner"></div>}
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
        /> {/* The Canvas is used as overlay for the rendering boxes */}
          <canvas ref={overlayRef} className="overlay" />
        <div className="capture-button-wrapper">
          <button className="capture-button" onClick={captureImage}>
            <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30}
              fill={"white"} viewBox="0 0 24 24">
              <path d="M10.5 5 11.5 4.33 12.5 5 12.17 3.83 13 3.12 12 3 11.5 2 11 3 10 3.12 10.83 3.83 10.5 5z" />
              <path d="M20.33 13.67 19.5 12 18.67 13.67 17 13.88 18.39 15.06 17.83 17 19.5 15.89 21.17 17 20.61 15.06 22 13.88 20.33 13.67z" />
              <path d="M4.83 9 6.5 7.89 8.17 9 7.61 7.05 9 5.88 7.33 5.67 6.5 4 5.67 5.67 4 5.88 5.39 7.05 4.83 9z" />
              <path d="m18.71,2.29c-.39-.39-1.02-.39-1.41,0L2.29,17.29c-.39.39-.39,1.02,0,1.41l3,3c.2.2.45.29.71.29s.51-.1.71-.29l15-15c.39-.39.39-1.02,0-1.41l-3-3ZM6,19.59l-1.59-1.59,9.09-9.09,1.59,1.59-9.09,9.09Zm10.5-10.5l-1.59-1.59,3.09-3.09,1.59,1.59-3.09,3.09Z" />
            </svg>
          </button>
        </div>

        {/* Custom Overlay */}
        {showForm && (
          <div className="form-overlay">
            <div className="form-container">
              {/* Close button */}
              <button className="close-button" onClick={handleClose}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <h3 className="form-title">Animal Detection Result</h3>

              {/* Visual Fields */}
              {capturedImage && (
                <div className="detection-result">
                  <img
                    src={capturedImage}
                    alt="Detected Animal"
                    className="detected-image"
                    style={{ maxWidth: "400px", maxHeight: "300px", objectFit: "contain" }}
                  />
                  {animalName && (
                    <>
                      <h4 className="animal-name">{animalName}</h4>
                      <p className="confidence">Confidence: {confidence * 100}%</p>
                    </>
                  )}
                </div>
              )}
              {/* Form */}
              <form onSubmit={handleSubmit} className="detection-form">
                <div className="form-group">
                  <label htmlFor="postName">Post Name</label>
                  <input
                    type="text"
                    id="postName"
                    name="postName"
                    placeholder="Enter a post title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    placeholder="Write something..."
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="geolocation">Enable Geolocation</label>
                  <div className="switch-container">
                    <label className="switch-label">
                      <input
                        type="checkbox"
                        id="geolocation"
                        name="geolocation"
                        className="geolocation-switch"
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>

                <button type="submit" className="submit-button">
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}

        {showPopup && (
          <div className="form-overlay">
            <div className="success-popup">
              <h4>Post created successfully</h4>
              <button
                className="submit-button"
                onClick={() => setShowPopup(false)}
              >
                OK
              </button>
            </div>
          </div>
        )}


        {capturedImage && (
          <div className="captured-image-wrapper">
            <img src={capturedImage} alt="Captured" className="captured-image" />
          </div>
        )}
      </Container>
    </Container>
  );
};

export default CapturePage; 

/*
import React, { useRef, useState, useEffect } from "react";
import { Container } from 'react-bootstrap';
import './CapturePage.css';
import { detectImage } from "../utility/detect";
import * as tf from "@tensorflow/tfjs";
import { loadModel } from "../utility/modelStorageOperations";

const CapturePage = () => {
  const [model, setModel] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    async function initModel() {
      const m = await loadModel();
      setModel(m);
    }
    initModel();
  }, []);

  useEffect(() => {
    if (model && canvasRef.current) {
      detectImage(model, 0.5, canvasRef.current).then(results => {
        console.log("Detection results in CapturePage:", results);
      });
    }
  }, [model]);


  return (
    <Container className="scanner-page">
      <Container className="webcam-wrapper">
        <canvas ref={canvasRef} className="overlay" />
      </Container>
    </Container>
  );
};

export default CapturePage; */
