import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Container } from 'react-bootstrap';
import './CapturePage.css';
import { FaCamera } from 'react-icons/fa';
import { IoMdClose } from "react-icons/io";
import AudioDetect from '../components/AudioDetect';

import axios from 'axios';

var animalName = "RubberDuck";
var confidence = "420.15";

const CapturePage = () => {
  const webcamRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [activeMode, setActiveMode] = useState('LIVE');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);


  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: { ideal: "environment" },
  };

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
    // Capture the image from webcam
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    // console.log("Captured Image (data URL):", imageSrc);
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

      // console.log("Prediction result:", response.data);

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
    <div className="scanner-page">
      <div className='closeScanner' onClick={() => window.history.back()}><IoMdClose className="icon-bold" /></div>

      <div className='scanner-main-content'>
        {/* Conditionally render webcam wrapper or AudioDetect based on activeMode */}
        {activeMode === 'AUDIO' ? (
          <AudioDetect />
        ) : (
          <div className="webcam-wrapper">
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

            {loading && (
              <div className="spinner-overlay">
                <div className="spinner"></div>
              </div>
            )}
          </div>
        )}

      </div>

      <div className="capture-footer">
        {activeMode == 'LIVE' && (
          <button className="capture-button" onClick={captureImage}>
            <FaCamera color="white" size={30} />
          </button>
        )}

        <div className="capture-nav">
          <span
            className={`captureNavButtons ${activeMode === 'UPLOAD' ? 'active' : ''}`}
            onClick={() => setActiveMode('UPLOAD')}
          >
            UPLOAD
          </span>
          <span
            className={`captureNavButtons ${activeMode === 'LIVE' ? 'active' : ''}`}
            onClick={() => setActiveMode('LIVE')}
          >
            LIVE
          </span>
          <span
            className={`captureNavButtons ${activeMode === 'AUDIO' ? 'active' : ''}`}
            onClick={() => setActiveMode('AUDIO')}
          >
            AUDIO
          </span>
        </div>
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
            {apiResponse?.image && (
              <div className="detection-result">
                <img
                  src={`data:image/png;base64,${apiResponse.image}`} // decode base64 from API
                  alt="Detected Animal"
                  className="detected-image"
                  style={{ maxWidth: "400px", maxHeight: "300px", objectFit: "contain" }}
                />
                {apiResponse.detection && (
                  <>
                    <h4 className="animal-name">{apiResponse.detection}</h4>
                    <p className="confidence">Confidence: {apiResponse.confidence * 100}%</p>
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
    </div>
  );
};

export default CapturePage;