import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Container } from 'react-bootstrap';
import './CapturePage.css';
import { FaCamera } from 'react-icons/fa';
import { IoMdClose } from "react-icons/io";
import { SightingsController } from '../controllers/SightingsController';
import { PostsController } from '../controllers/PostsController';

import axios from 'axios';

var animalName = "RubberDuck";
var confidence = "420.15";

const CapturePage = () => {
  const webcamRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showFailPopup, setShowFailPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [descriptionError, setDescriptionError] = useState(false); // New state for error


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

    setCapturedImage(imageSrc);
    setBackgroundImage(imageSrc);

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

  const resetBackground = () => {
    setBackgroundImage(null);
  };

  const resetCapture = () => {
    setCapturedImage(null);
  };

  const handleClose = () => {
    setShowForm(false);
    resetCapture();
  }

  const handleSubmit = async (event) => {
    setLoading(true);

    try {
      event.preventDefault();
      const formData = new FormData(event.target);

      const description = formData.get('description').trim();

      // Validate description
      if (!description) {
        setDescriptionError(true); // Show error message
        setLoading(false);
        return;
      }
      setDescriptionError(false); // Clear error if valid

      let geoLocLat = null;
      let geoLocLong = null;

      if (formData.get('geolocation') === 'on' && navigator.geolocation) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        geoLocLat = position.coords.latitude;
        geoLocLong = position.coords.longitude;
      }

      // Convert base64 image to Blob
      const byteString = atob(capturedImage.split(",")[1]);
      const mimeString = capturedImage.split(",")[0].split(":")[1].split(";")[0];
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }
      const imageBlob = new Blob([uint8Array], { type: mimeString });

      // Sighting
      const sightingData = new FormData();
      sightingData.append("animal", apiResponse.detection);
      sightingData.append("confidence", (apiResponse.confidence * 100).toFixed(2));
      sightingData.append("longitude", geoLocLong);
      sightingData.append("latitude", geoLocLat);
      sightingData.append("file", imageBlob);

      const sightResult = await SightingsController.handleCreateSighting(sightingData);

      // Post
      let postResult = null;
      if (sightResult.success) {
        postResult = await PostsController.handleCreatePost(
          sightResult.result.identification_id,
          description,
          formData.get('geolocation') === 'on' ? true : false
        );
      }

      if (postResult===null || !postResult.success || !postResult) {
        setLoading(false);
        setShowForm(false);
        setShowFailPopup(true);
        resetCapture();
        throw new Error("Failed to create post");
      }

      setShowForm(false);
      setShowSuccessPopup(true);
      resetCapture();
    } catch (err) {
      console.error("Error during submission:", err);
      setShowForm(false);
      setShowFailPopup(true);
    } finally {
      setLoading(false);
      resetBackground();
    }
  };

  return (
    <div className="scanner-page">
      <div className='closeScanner' onClick={() => window.history.back()}><IoMdClose className="icon-bold" /></div>
      <div className="webcam-wrapper">
        {backgroundImage ? (
          <img
            src={capturedImage}
            alt="Captured"
            className="display-cap-image"
          />
        ) : (
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
        )}
      </div>
      <div className="capture-footer">
        <button className="capture-button" onClick={captureImage}><FaCamera color="white" size={30}></FaCamera></button>
        <div className="capture-nav">
          <span className="captureNavButtons">UPLOAD</span>
          <span className="captureNavButtons">LIVE</span>
          <span className="captureNavButtons">AUDIO</span>
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
                  src={`data:image/png;base64,${apiResponse.image}`}
                  alt="Detected Animal"
                  className="detected-image"
                />
                {apiResponse.detection ? (
                  <>
                    <h4 className="animal-name">{apiResponse.detection}</h4>
                    <p className="confidence">Confidence: {(apiResponse.confidence * 100).toFixed(2)}%</p>
                    <hr style={{ width: "85%", backgroundColor: "lightgrey", height: "2px", border: "none" }} />

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="detection-form">
                      <div className="form-group">
                        <label htmlFor="description" style={{ left: 0 }}>Description</label>
                        {descriptionError && (
                          <p className="error-message">Description cannot be empty.</p>
                        )}
                        <textarea
                          id="description"
                          name="description"
                          rows="3"
                          placeholder="Write something..."
                        ></textarea>
                      </div>

                      {/* Add geolocation conditional for rhino */}
                      <div className="form-group">
                        <label htmlFor="geolocation">Enable Geolocation</label>
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

                      <button type="submit" className="submit-button">
                        Submit
                      </button>
                    </form>
                  </>
                ):(
                  <>
                    <h4 className="animal-name">No Animal Detected</h4>
                    <button className="submit-button" onClick={handleClose}>
                      OK
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}

      {showSuccessPopup && (
        <div className="form-overlay">
          <div className="success-popup">
            <h4>Post created successfully</h4>
            <button
              className="submit-button"
              onClick={() => setShowSuccessPopup(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {showFailPopup && (
        <div className="form-overlay">
          <div className="success-popup">
            <h4>Failed to Create Post</h4>
            <button
              className="submit-button"
              onClick={() => setShowFailPopup(false)}
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