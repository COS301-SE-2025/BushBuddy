import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Navbar, Button } from 'react-bootstrap';
import './MainScreen.css';

const MainScreen = () => {
    const navigate = useNavigate();

    return( 
        <div className="main-screen">


            <h1>This is the main screen</h1>

            
        </div>
    );
};

export default MainScreen;