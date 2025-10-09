import React, { useRef, useState, useEffect } from "react";
import Webcam from 'react-webcam';
import { useNavigate } from "react-router-dom";
import { Container } from 'react-bootstrap';
import './CapturePage.css';
import { detectImage } from "../utility/detect";
import * as tf from "@tensorflow/tfjs";
import { loadModel } from "../utility/modelStorageOperations";
import endangered from "../utility/endangered.json"
import { FaCamera } from 'react-icons/fa';
import { IoMdClose } from "react-icons/io";
import AudioDetect from '../components/AudioDetect';
import ServerSideDetect from '../components/ServerSideDetect';
import { SightingsController } from '../controllers/SightingsController';
import { PostsController } from '../controllers/PostsController';


//-- Mock data
// import axios from 'axios';

const CapturePage = () => {
  const [model, setModel] = useState(null);
  useEffect(() => {
    async function initModel() {
      const m = await loadModel();
      setModel(m);
    }
    initModel();
  }, []);

  const [animalName, setAnimalName] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const navigate = useNavigate();

  const overlayRef = useRef(null);
  const webcamRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [activeMode, setActiveMode] = useState('LIVE');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showFailPopup, setShowFailPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [descriptionError, setDescriptionError] = useState(false);


  const videoConstraints = {
    width: { ideal:  1280},
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
    setBackgroundImage(imageSrc);

    const img = new Image();
    img.src = imageSrc;
    setLoading(true);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      // Call an async function here
      runDetection(img, canvas);
    };
  };

  const runDetection = async (img, canvas) => {
    try {
      const results = await detectImage(model, 0.5, canvas, img);

      console.log("Detection results CapturePage: ", results);

      let labels = results.labels || [];
      let scores = results.scores || [];

      const filtered = labels
      .map((label, i) => ({ label, score: scores[i] }))
      .filter(item => item.label !== "Background");

      if (filtered.length === 0) {
      // If background was the only result
      setAnimalName(["No results found"]);
      setConfidence([]);
    } else {
      setAnimalName(filtered.map(f => f.label));
      setConfidence(filtered.map(f => f.score));
    }

      setCapturedImage(img.src);
      setShowForm(true);
    } catch (err) {
      console.error("Error during detection:", err);
    }
    finally{
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
    resetBackground();
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
      sightingData.append("animal", animalName[0] ?? "Unknown");
      sightingData.append(
        "confidence",
        confidence[0] ? (confidence[0] * 100).toFixed(2) : "0"
      );
      sightingData.append("longitude", geoLocLong);
      sightingData.append("latitude", geoLocLat);
      sightingData.append("file", imageBlob);

      const sightResult = await SightingsController.handleCreateSighting(sightingData);

      // Post
      let postResult = null;
      if (sightResult.success) {
        console.log("hello");

        postResult = await PostsController.handleCreatePost(
          sightResult.result.identification_id,
          description,
          formData.get('geolocation') === 'on' ? true : false
        );
      }

      if (postResult === null || !postResult.success || !postResult) {
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
      <div className='closeScanner' onClick={() => navigate('/feed')}><IoMdClose className="icon-bold" /></div>

      <div className='scanner-main-content'>
        {activeMode === 'UPLOAD' ? (
          <ServerSideDetect />
        ) : activeMode === 'AUDIO' ? (
          <AudioDetect />
        ) : (
          <div className="webcam-wrapper">
          { backgroundImage ? (
              <img src={backgroundImage} alt="Background" className="display-cap-image" />
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

            {capturedImage && (
              <div className="detection-result">
                <img
                  src={capturedImage}
                  alt="Detection Result"
                  className="detected-image-live"
                />

                {/* CASE 1: No results OR only "Background" */}
                {animalName.length === 0 || (animalName.length === 1 && (animalName[0] === "Background" || animalName[0] === "No results found" )) ? (
                  <div className="popup-message">
                    <h4 className="animal-name">No results found</h4>
                    <button className="submit-button" onClick={handleClose}>
                      OK
                    </button>
                  </div>
                ) : (
                  <>
                    {/* CASE 2: Animal(s) detected → Show form */}
                    <h4 className="animal-name">{animalName.join(", ")}</h4>

                    {confidence.length > 0 && (
                      <p className="confidence">
                        Confidence: {confidence.map(c => `${(c * 100).toFixed(2)}%`).join(", ")}
                      </p>
                    )}

                    <hr
                      style={{
                        width: "85%",
                        backgroundColor: "lightgrey",
                        height: "2px",
                        border: "none",
                      }}
                    />

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

                      {/* Only show geolocation if none of the detected animals are endangered */}
                      {!animalName.some(name => endangered.includes(name)) && (
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
                      )}

                      <button type="submit" className="submit-button">
                        Submit
                      </button>
                    </form>
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
