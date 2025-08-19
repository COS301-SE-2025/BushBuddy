import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Navbar, Button } from 'react-bootstrap';
import './MainScreen.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft, faMapMarkedAlt, faGear, faCamera } from '@fortawesome/free-solid-svg-icons';
import { FaCamera } from 'react-icons/fa';

import { checkAuthStatus } from "../controllers/UsersController";  // remove this later

const MainScreen = () => {
    const navigate = useNavigate();
    const userName = "Jean Steyn";

    return (
        <div className="main-screen">

            <Container className='welcome-message'>
                <h2>Welcome, {userName}</h2>
            </Container>

            <h1>Quick Actions</h1>
            <Container className='quick-actions'>
                <Container className='actions-container'>
                    <div className='quick-action-wrapper'>
                        <Button className='action-button' onClick={() => navigate("/capture") }>
                            <FontAwesomeIcon icon={faCamera} size='2x' />
                        </Button>
                        <label>Scanner</label>
                    </div>

                    <div className='quick-action-wrapper'>
                        <Button className='action-button' onClick={() => navigate("/feed")}>
                            <FontAwesomeIcon icon={faClockRotateLeft} size='2x' />
                        </Button>
                        <label>History</label>
                    </div>

                    <div className='quick-action-wrapper'>
                        <Button className='action-button' onClick={() => navigate("/map")}>
                            <FontAwesomeIcon icon={faMapMarkedAlt} size='2x' />
                        </Button>
                        <label>Map</label>
                    </div>

                    <div className='quick-action-wrapper'>
                        <Button className='action-button' onClick={() => navigate("/profile")}>
                            <FontAwesomeIcon icon={faGear} size='2x' />
                        </Button>
                        <label>Settings</label>
                    </div>
                </Container>
            </Container>

            <Container className='bestiary'>
                <h1>Bestiary</h1>
                <Container className='bestiary-container'>
                    This section is under construction
                    <Container className='bestiary-filters'>

                    </Container>

                    <Container className='bestiary-cards-wrapper'>

                    </Container>
                </Container>
            </Container>
        </div>
    );
};

export default MainScreen;