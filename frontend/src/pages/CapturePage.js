import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Container, Modal, Button, Form } from 'react-bootstrap';
import './CapturePage.css';

const CapturePage = () => {
  const webcamRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: { ideal: "environment" },
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      console.log("Captured Image:", imageSrc);
      setShowForm(true);
      //Storing capture image
    }
  };

  const handleClose = () => setShowForm(false);
  const handleSubmit = (event) => {
    event.preventDefault();

    // Handle form submission
    console.log("Form submitted");
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

        <Modal 
          show={showForm} 
          onHide={handleClose} 
          centered 
          size="sm" 
          dialogClassName="custom-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Captured Image Info</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {capturedImage && (
              <img 
                src={capturedImage} 
                alt="Captured" 
                className="img-fluid mb-3" 
                style={{ borderRadius: "10px", maxHeight: "150px" }} 
              />
            )}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter name" required />
              </Form.Group> 
              <Form.Group className="mb-3" controlId="formNotes">
                <Form.Label>Notes</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Add notes" />
              </Form.Group>
              <Button variant="primary" type="submit">Submit</Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </Container>
  );
};

export default CapturePage;
