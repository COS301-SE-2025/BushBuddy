import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Container, Alert, Spinner, Card, Badge } from 'react-bootstrap';
import './CapturePage.css';

const CapturePage = () => {
  const webcamRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [geolocation, setGeolocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: { ideal: "environment" },
  };

  // Get user's geolocation on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeolocation({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Unable to get location. Please enable location services.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  }, []);

  // Convert base64 image to blob
  const dataURLToBlob = (dataURL) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };



  const captureAndAnalyze = async () => {
    try {
      // Clear previous results
      setError(null);
      setPredictions([]);
      
      // Check if geolocation is available
      if (!geolocation) {
        setError('Location is required for sighting creation. Please enable location services and refresh the page.');
        return;
      }

      // Capture image
      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) {
        setError('Failed to capture image. Please try again.');
        return;
      }

      setCapturedImage(imageSrc);
      setIsProcessing(true);

      // Convert base64 to blob
      const imageBlob = dataURLToBlob(imageSrc);

      // Prepare form data
      const formData = new FormData();
      formData.append('file', imageBlob, 'capture.jpg');
      formData.append('longitude', geolocation.longitude.toString());
      formData.append('latitude', geolocation.latitude.toString());

      // Make API call to backend (cookies sent automatically)
      const response = await fetch('/api/sightings', {
        method: 'POST',
        credentials: 'include', // This ensures cookies are sent with the request
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to analyze image');
      }

      if (result.success) {
        // Extract predictions from the response
        const animals = result.data.animals || [];
        setPredictions(animals);
        
        if (animals.length === 0) {
          setError('No animals detected in the image. Try capturing a clearer image or getting closer to the animal.');
        }
      } else {
        throw new Error(result.message || 'Analysis failed');
      }

    } catch (error) {
      console.error('Error during image analysis:', error);
      setError(error.message || 'Failed to analyze image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setPredictions([]);
    setError(null);
  };

  return (
    <Container className="scanner-page">
      {/* Location Status */}
      {locationError && (
        <Alert variant="warning" className="mb-3">
          <strong>Location Error:</strong> {locationError}
        </Alert>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="danger" className="mb-3">
          <strong>Error:</strong> {error}
        </Alert>
      )}

      {/* Camera/Image Display */}
      <Container className="webcam-wrapper">
        {capturedImage ? (
          <div className="captured-image-container">
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="captured-image"
              style={{ width: '100%', maxWidth: '640px', height: 'auto' }}
            />
            <div className="capture-button-wrapper">
              <button 
                className="capture-button reset-button" 
                onClick={resetCapture}
                disabled={isProcessing}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} 
                     fill="white" viewBox="0 0 24 24">
                  <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <>
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
              <button 
                className="capture-button" 
                onClick={captureAndAnalyze}
                disabled={isProcessing || !geolocation}
              >
                {isProcessing ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30}
                       fill={"white"} viewBox="0 0 24 24">
                    <path d="M10.5 5 11.5 4.33 12.5 5 12.17 3.83 13 3.12 12 3 11.5 2 11 3 10 3.12 10.83 3.83 10.5 5z" />
                    <path d="M20.33 13.67 19.5 12 18.67 13.67 17 13.88 18.39 15.06 17.83 17 19.5 15.89 21.17 17 20.61 15.06 22 13.88 20.33 13.67z" />
                    <path d="M4.83 9 6.5 7.89 8.17 9 7.61 7.05 9 5.88 7.33 5.67 6.5 4 5.67 5.67 4 5.88 5.39 7.05 4.83 9z" />
                    <path d="m18.71,2.29c-.39-.39-1.02-.39-1.41,0L2.29,17.29c-.39.39-.39,1.02,0,1.41l3,3c.2.2.45.29.71.29s.51-.1.71-.29l15-15c.39-.39.39-1.02,0-1.41l-3-3ZM6,19.59l-1.59-1.59,9.09-9.09,1.59,1.59-9.09,9.09Zm10.5-10.5l-1.59-1.59,3.09-3.09,1.59,1.59-3.09,3.09Z" />
                  </svg>
                )}
              </button>
            </div>
          </>
        )}
      </Container>

      {/* Processing Status */}
      {isProcessing && (
        <div className="text-center mt-3">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Analyzing image with AI model...</p>
        </div>
      )}

      {/* Predictions Display */}
      {predictions.length > 0 && (
        <Container className="predictions-container mt-4">
          <h4>Animals Detected:</h4>
          <div className="predictions-grid">
            {predictions.map((prediction, index) => (
              <Card key={index} className="prediction-card mb-2">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="mb-1">{prediction.animal || 'Unknown Animal'}</h5>
                      <small className="text-muted">
                        Confidence: {prediction.confidence}%
                      </small>
                    </div>
                    <Badge 
                      variant={prediction.confidence > 80 ? 'success' : 
                               prediction.confidence > 60 ? 'warning' : 'secondary'}
                      className="confidence-badge"
                    >
                      {prediction.confidence}%
                    </Badge>
                  </div>
                  {prediction.confirmed && (
                    <Badge variant="info" className="mt-2">Confirmed</Badge>
                  )}
                  {prediction.protected && (
                    <Badge variant="danger" className="mt-2 ml-2">Protected Species</Badge>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
        </Container>
      )}

      {/* Location Info */}
      {geolocation && (
        <div className="location-info mt-3">
          <small className="text-muted">
            Location: {geolocation.latitude.toFixed(6)}, {geolocation.longitude.toFixed(6)}
          </small>
        </div>
      )}
    </Container>
  );
};

export default CapturePage;