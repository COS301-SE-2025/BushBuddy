import React from "react";
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import './LandingPage.css'
import InstallPrompt from '../components/InstallPrompt';

const LandingPage = () => {
  const navigate = useNavigate();

  

  return (
    <Container className="landing-page">
      <Container className="heading-container">
        <h1>Welcome to BushBuddy!</h1>
        <h2>Track, Discover, Share</h2>
      </Container>

      <Container className="actions-container">
        <Button onClick={() => navigate("/login")} className="button">Log in/Register</Button>
        <InstallPrompt />
      </Container>

      

    </Container>
  );
};


export default LandingPage;