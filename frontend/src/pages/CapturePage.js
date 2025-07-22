import React from 'react';
import Webcam from 'react-webcam'
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './CapturePage.css';

const CapturePage = () => {

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };

    return (
        <Container className="scanner-page">
            <Container className='webcam-wrapper'>
                <Webcam
                    className='webcam'
                    audio={false}  //remove this when we get audio detection
                    // height={720}
                    screenshotFormat="image/jpeg"
                    // width={1280}
                    videoConstraints={videoConstraints}
                >
                    {({ getScreenshot }) => (
                        <div className='capture-button-wrapper'>
                            <button
                                className='capture-button'
                                onClick={() => {
                                    const imageSrc = getScreenshot()
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30}
                                    fill={"white"} viewBox="0 0 24 24" >    
                                    <path d="M10.5 5 11.5 4.33 12.5 5 12.17 3.83 13 3.12 12 3 11.5 2 11 3 10 3.12 10.83 3.83 10.5 5z"></path>
                                    <path d="M20.33 13.67 19.5 12 18.67 13.67 17 13.88 18.39 15.06 17.83 17 19.5 15.89 21.17 17 20.61 15.06 22 13.88 20.33 13.67z"></path>
                                    <path d="M4.83 9 6.5 7.89 8.17 9 7.61 7.05 9 5.88 7.33 5.67 6.5 4 5.67 5.67 4 5.88 5.39 7.05 4.83 9z"></path>
                                    <path d="m18.71,2.29c-.39-.39-1.02-.39-1.41,0L2.29,17.29c-.39.39-.39,1.02,0,1.41l3,3c.2.2.45.29.71.29s.51-.1.71-.29l15-15c.39-.39.39-1.02,0-1.41l-3-3ZM6,19.59l-1.59-1.59,9.09-9.09,1.59,1.59-9.09,9.09Zm10.5-10.5l-1.59-1.59,3.09-3.09,1.59,1.59-3.09,3.09Z"></path>
                                </svg>
                            </button>
                        </div>
                    )}
                </Webcam>
            </Container>
        </Container>
    );
};

export default CapturePage;