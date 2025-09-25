import React, { useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import './ServerSideDetect.css';
import axios from 'axios';

const ServerSideDetect = () => {
    const fileInputRef = useRef(null);

    const [showForm, setShowForm] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [apiResponse, setApiResponse] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false);

    // Convert file to base64
    const toBase64 = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(",")[1]); // clean base64
            reader.onerror = (error) => reject(error);
        });
    };

    // Handle file upload
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }

        console.log("Selected file:", file);

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setCapturedImage(previewUrl);

        setLoading(true);

        try {
            // Convert to base64
            const base64Image = await toBase64(file);

            // Send to API
            const response = await axios.post(
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
            alert('Failed to process image. Please try again.');
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
        <Container className="upload-page">
            {loading && <div className="spinner"></div>}

            <div className="upload-options">
                <h1>Upload a Photo</h1>
                <p>Higher detection accuracy</p>
                <p>Less battery usage, uses more mobile data</p>

                {/* Upload Button */}
                <div className="upload-section">
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
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24}
                            fill={"white"} viewBox="0 0 24 24">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                        </svg>
                        Upload Image
                    </button>
                </div>
            </div>

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
        </Container>
    );
};

export default ServerSideDetect;