import React from "react";
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import './LandingPage.css'
import InstallPrompt from '../components/InstallPrompt';
import logo from "../assets/BushBuddy_Green.png"
import VideoBackground from "../components/VideoBackground";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <VideoBackground />

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