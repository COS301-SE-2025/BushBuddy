import React from "react";
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import './LandingPage.css'
import InstallPrompt from '../components/InstallPrompt';
import logo from "../assets/BushBuddy.webp"

const LandingPage = () => {
  const navigate = useNavigate();

  //ToDo: When user management is implemented, swap this page with a splash screen

  return (
    <Container className="landing-page">
      <Container className="heading-container">
        <img src={logo} alt="BushBuddy Logo" className="logo-image"></img>
        <h1>Welcome to BushBuddy!</h1>
        <h2>Track, Discover, Share</h2>
      </Container>

      <Container className="actions-container">
        <InstallPrompt />
        <Button onClick={() => navigate("/login")} className="button">Log in/Register</Button>
      </Container>

      

    </Container>
  );
};


export default LandingPage;