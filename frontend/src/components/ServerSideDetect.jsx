import React, { useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import './ServerSideDetect.css';
import axios from 'axios';
import endangered from "../utility/endangered.json"
import { SightingsController } from '../controllers/SightingsController';
import { PostsController } from '../controllers/PostsController';

const ServerSideDetect = () => {
    const fileInputRef = useRef(null);

    const [showForm, setShowForm] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [animalName, setAnimalName] = useState(null);
    const [confidence, setConfidence] = useState(null);
    const [apiImage, setApiImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showFailPopup, setShowFailPopup] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);

    // Convert file to base64
    const toBase64 = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
        });
    };

    // Handle file upload
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        setCapturedImage(previewUrl);
        setLoading(true);

        try {
            const base64Image = await toBase64(file);

            const response = await axios.post(
                'https://RuanEsterhuizen-BushBuddy.hf.space/detect',
                { image: base64Image },
                { headers: { 'Content-Type': 'application/json' } }
            );
            console.log("AI API Response:" ,response);
            setAnimalName(response.data.detection ?? 'Unknown');
            setConfidence(response.data.confidence ?? 0);
            setApiImage(response.data.image);
            setShowForm(true);
        } catch (err) {
            console.error('API request failed:', err);
            alert('Failed to process image.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setShowForm(false);
        setCapturedImage(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(event.target);
            const description = formData.get('description')?.trim();
            const shareLocation = formData.get('geolocation') === 'on';

            if (!description) {
                setDescriptionError(true);
                setLoading(false);
                return;
            }
            setDescriptionError(false);

            let geoLocLat = null;
            let geoLocLong = null;

            if (shareLocation && navigator.geolocation) {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                geoLocLat = position.coords.latitude;
                geoLocLong = position.coords.longitude;
            }

            // Convert previewUrl -> Blob
            const response = await fetch(capturedImage);
            const imageBlob = await response.blob();

            // Sighting
            const sightingData = new FormData();
            sightingData.append('animal', animalName ?? 'Unknown');
            sightingData.append(
                'confidence',
                confidence ? (confidence * 100).toFixed(2) : '0'
            );
            sightingData.append('longitude', geoLocLong);
            sightingData.append('latitude', geoLocLat);
            sightingData.append('file', imageBlob);

            const sightResult = await SightingsController.handleCreateSighting(sightingData);

            let postResult = null;
            if (sightResult.success) {
                postResult = await PostsController.handleCreatePost(
                    sightResult.result.identification_id,
                    description,
                    shareLocation
                );
            }

            if (!postResult || !postResult.success) {
                setShowFailPopup(true);
                throw new Error('Failed to create post');
            }

            setShowForm(false);
            setShowSuccessPopup(true);
        } catch (err) {
            console.error('Submission failed:', err);
            setShowFailPopup(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="upload-page">
            <div className="upload-options">
                <h1>Upload a Photo</h1>
                <p>Higher detection accuracy</p>
                <p>Less battery usage, uses more mobile data</p>

                <div className="upload-section">
                {!loading && (
                    <>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <button
                            className="upload-button"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Upload Image
                        </button>
                    </>
                )}
                </div>
            </div>

            {loading && (
                <div className="spinner-overlay">
                <div className="spinner"></div>
                </div>
            )}

            {showForm && (
                <div className="form-overlay">
                    <div className="form-container">
                        <button className="close-button" onClick={handleClose}>
                            ✕
                        </button>

                        <h3 className="form-title">Animal Detection Result</h3>

                        <div className="detection-result">
                            {apiImage ? (
                                <img
                                    src={`data:image/png;base64,${apiImage}`}
                                    alt="Detected Animal"
                                    className="detected-image"
                                />
                            ) : (
                                capturedImage && (
                                    <img
                                        src={capturedImage}
                                        alt="Uploaded"
                                        className="detected-image"
                                    />
                                )
                            )}
                            <h4 className="animal-name">{animalName}</h4>
                            <p className="confidence">
                                Confidence: {(confidence * 100).toFixed(2)}%
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="detection-form">
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
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
                            {!endangered.includes(animalName) && (
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
                    </div>
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
        </Container>
    );
};

export default ServerSideDetect;
