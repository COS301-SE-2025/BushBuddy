import React from "react";
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import './LandingPage.css'
import InstallPrompt from '../components/InstallPrompt';
import logo from "../assets/BushBuddy_Green.png"

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="video-background"
      >
        <source src={require(`../assets/nature-background.mp4`)} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content Container */}
      <Container fluid className="content-overlay">
        <Container className="content-container">

          <Container className="heading-container">
            <img src={logo} alt="BushBuddy Logo" className="logo-image"></img>
            <h1 className="heading-text">Welcome to BushBuddy!</h1>
            <h2>Track, Discover, Share</h2>
          </Container>

          <Container className="login-container">
            <InstallPrompt />
            <Button onClick={() => navigate("/login")} className="button">Log in/Register</Button>
            <a onClick={() => navigate("/about")}>About us</a>
          </Container>

        </Container>
      </Container>
    </div>
  );
};


export default LandingPage;