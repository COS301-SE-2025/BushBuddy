import React from "react";
import './AboutPage.css';
import { useNavigate } from 'react-router-dom'

const AboutPage = () => {
    const navigate = useNavigate();

    return (
        <div className="about-page">
            <div className="about-content">
                <button onClick={() => navigate(-1)} className="back-button">Back</button>

                <h1>About BushBuddy</h1>

                <h2>What is BushBuddy?</h2>
                <p className="about-text">Unleash the power of instant wildlife recognition: where every encounter with African wildlife becomes an opportunity for discovery. In this vibrant ecosystem where animals communicate through both sight and sound, our mission is clear - create a system that transforms your device into a real-time wildlife identifier.</p>

                <h2>Vision</h2>
                <p className="about-text">Our vision is for users to reliably identify African wild animals, using a AI-powered image/audio detection system.</p>

                <h2>Mission</h2>
                <p className="about-text">Our mission is for our platform to promote awareness, education and appreciation for South African wildlife.</p>
                <p className="about-text">We seek to cultivate a community of users who are inspired to explore local nature reserves and contribute to conservation efforts.</p>  

                <h2>ReturnZero</h2>
                <p className="about-text">BushBuddy is developed by team ReturnZero for the University of Pretoria COS301 2025 Capstone project.</p>
                <p className="about-text">Created in collaboration with EpiUse</p>

                <h2>Read More</h2>
                <p className="about-text">Visit our <a className="about-link" href="https://github.com/COS301-SE-2025/AI-Powered-African-Wildlife-Detection">GitHub</a>.</p>

                <h2>Contact Us</h2>
                <p className="about-text">Team email: <a className="about-link" href="g24capstone@gmail.com">g24capstone@gmail.com</a>.</p>

            </div>
        </div >
    );
};


export default AboutPage;