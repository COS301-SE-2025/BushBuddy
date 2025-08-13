import React from "react";
import { useNavigate } from "react-router-dom";
import './404_Page.css';
import NotFoundImage from '../../assets/mascot/NotFound.png';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className='not-found-page'>
            <div className="not-found-content">
                <h1>404 Error</h1>
                <h2>Sorry, the page you are looking for does not exist.</h2>

                <button onClick={() => navigate(-1)} className="back-button">Back</button>
            </div>

            <div>
                <img className='not-found-image' src={ NotFoundImage } height={450}></img>

                <p className="image-notice"><b>*Notice:</b> The above image is AI generated.</p>
            </div>

        </div>
    );
};

export default NotFoundPage;