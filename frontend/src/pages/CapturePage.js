import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Container } from 'react-bootstrap';
import './CapturePage.css';

import axios from 'axios';

var animalName = "RubberDuck";
var confidence = "420.15";
var image;

const API_URL = process.env.REACT_APP_API_URL;

const CapturePage = () => {
  const webcamRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);


  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: { ideal: "environment" },
  };

  function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64); // decode base64 → binary string
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  function compressBase64Image(base64, maxWidth = 1024, quality = 0.8) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64.split(',')[1]); // Remove data URL prefix
      };
      img.src = `data:image/jpeg;base64,${base64}`;
    });
  }

async function createSighting(base64Image) {
    try {
        const mimeType = "image/jpeg";
        const blob = base64ToBlob(base64Image, mimeType);

        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
            });
        });
        const { latitude, longitude } = position.coords;

        const formData = new FormData();
        formData.append("longitude", longitude.toString());
        formData.append("latitude", latitude.toString());
        formData.append("file", blob, "sighting.jpg");

        // Use XMLHttpRequest instead of fetch to bypass the issue
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open('POST', 'https://bushbuddy-api-dev.onrender.com/sightings/');
            
            // Add credentials (equivalent to credentials: 'include' in fetch)
            xhr.withCredentials = true;

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (e) {
                        console.log('Response is not JSON:', xhr.responseText);
                        resolve(xhr.responseText);
                    }
                } else {
                    reject(new Error(`HTTP ${xhr.status}: ${xhr.responseText}`));
                }
            };

            xhr.onerror = () => {
                reject(new Error('Network error'));
            };

            xhr.ontimeout = () => {
                reject(new Error('Request timeout'));
            };

            xhr.timeout = 120000;

            console.log('Sending XMLHttpRequest with credentials...');
            xhr.send(formData);
        });

    } catch (error) {
        console.error("Upload error:", error);
        throw error;
    }
}

  const captureImage = async () => {
    // Capture the image from webcam
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    console.log("Captured Image (data URL):", imageSrc);
    setCapturedImage(imageSrc);

    // Convert to clean Base64 (remove "data:image/jpeg;base64," header)
    const base64Image = imageSrc.split(",")[1];
    // console.log("Clean Base64 preview:", base64Image.substring(0, 50) + "...");

    // Send to API
    try {
      const response = await axios.post(
        "http://localhost:7860/detect",
        // "https://RuanEsterhuizen-BushBuddy.hf.space/detect",
        { image: base64Image },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Prediction result:", response.data);

      animalName = response.data.detection;
      confidence = response.data.confidence;
      image = response.data.image;

      createSighting(image,)

      setApiResponse(response.data);

      if (animalName == null) {
        animalName = "No animals found";
        confidence = "";
      }

      setShowForm(true);

    } catch (err) {
      console.error("API request failed:", err);
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
                      <p className="confidence">Confidence: {apiResponse.confidence}%</p>
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
      </Container>
    </Container>
  );
};

export default CapturePage;