import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Navbar, Button } from 'react-bootstrap';
import './MainScreen.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft, faMapMarkedAlt, faGear, faCamera } from '@fortawesome/free-solid-svg-icons';
import { FaCamera } from 'react-icons/fa';
import BestiaryComponent from './BestiaryComponent'; // Import the new component
import SettingsModal from '../components/SettingsModal'; // Adjust path as needed

const MainScreen = () => {
    const navigate = useNavigate();
    const userName = "Ruan Esterhuizen";
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    
    // Settings state - you might want to move this to a context or parent component later
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [locationTracking, setLocationTracking] = useState(false);

    const handleScannerClick = () => {
        navigate('/capture'); // Adjust route as needed
    };

    const handleMapClick = () => {
        navigate('/map'); // Adjust route as needed
    };

    const handleSettingsClick = () => {
        setShowSettingsModal(true);
    };

    const closeSettingsModal = () => {
        setShowSettingsModal(false);
    };

    const handleToggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const handleToggleNotifications = () => {
        setNotifications(!notifications);
    };

    const handleToggleLocation = () => {
        setLocationTracking(!locationTracking);
    };

    return (
        <div className="main-screen">

            <Container className='welcome-message'>
                <h2>Welcome, {userName}</h2>
            </Container>

            <h1>Quick Actions</h1>
            <Container className='quick-actions'>
                <Container className='actions-container'>
                    <div className='quick-action-wrapper'>
                        <Button className='action-button' onClick={handleScannerClick}>
                            <FontAwesomeIcon icon={faCamera} size='2x' />
                        </Button>
                        <label>Scanner</label>
                    </div>

                    <div className='quick-action-wrapper'>
                        <Button className='action-button' onClick={handleMapClick}>
                            <FontAwesomeIcon icon={faMapMarkedAlt} size='2x' />
                        </Button>
                        <label>Map</label>
                    </div>

                    <div className='quick-action-wrapper'>
                        <Button className='action-button' onClick={handleSettingsClick}>
                            <FontAwesomeIcon icon={faGear} size='2x' />
                        </Button>
                        <label>Settings</label>
                    </div>
                </Container>
            </Container>

            <Container className='bestiary'>
                <h1>Bestiary</h1>
                <Container className='bestiary-container'>
                    {/* Replace the "under construction" text with the actual component */}
                    <BestiaryComponent />
                </Container>
            </Container>

            {/* Settings Modal */}
            <SettingsModal 
                show={showSettingsModal} 
                onClose={closeSettingsModal}
                darkMode={darkMode}
                onToggleDarkMode={handleToggleDarkMode}
                notifications={notifications}
                onToggleNotifications={handleToggleNotifications}
                locationTracking={locationTracking}
                onToggleLocation={handleToggleLocation}
            />
        </div>
    );
};

export default MainScreen;