import React, { useState, useRef, useEffect } from 'react';
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
	// const userName = sessionStorage.getItem('profile') ? JSON.parse(sessionStorage.getItem('profile')).username : 'User';
	const [showSettingsModal, setShowSettingsModal] = useState(false);
	const [userName, setUserName] = useState('User');
	const loadedProfile = useRef(false);

	// Settings state - you might want to move this to a context or parent component later
	const [darkMode, setDarkMode] = useState(false);
	const [notifications, setNotifications] = useState(true);
	const [locationTracking, setLocationTracking] = useState(false);

	const loadProfile = () => {
		const profile = sessionStorage.getItem('profile');

		if (profile && !loadedProfile.current) {
			const parsed = JSON.parse(profile);
			setUserName(parsed.username);
			loadedProfile.current = true;
		} else if (!profile) {
			// reset if no profile is stored
			loadedProfile.current = false;
			setUserName('User');
		}
	};

	useEffect(() => {
		loadProfile();

		const handleProfileUpdated = () => loadProfile();
		const handleProfileCleared = () => loadProfile();

		window.addEventListener('profileUpdated', handleProfileUpdated);
		window.addEventListener('profileCleared', handleProfileCleared);

		return () => {
			window.removeEventListener('profileUpdated', handleProfileUpdated);
			window.removeEventListener('profileCleared', handleProfileCleared);
		};
	}, []);

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
			<div className="welcome-message">
				<h2 className="bestiary-welcome">Welcome, {userName}</h2>
				<h1 className="bestiary-heading">Quick Actions</h1>
			</div>
			<div className="actions-container">
				<div className="quick-action-wrapper">
					<Button className="action-button" onClick={handleScannerClick}>
						<FontAwesomeIcon icon={faCamera} size="2x" />
					</Button>
					<label>Scanner</label>
				</div>

				<div className="quick-action-wrapper">
					<Button className="action-button" onClick={handleMapClick}>
						<FontAwesomeIcon icon={faMapMarkedAlt} size="2x" />
					</Button>
					<label>Map</label>
				</div>

				<div className="quick-action-wrapper">
					<Button className="action-button" onClick={handleSettingsClick}>
						<FontAwesomeIcon icon={faGear} size="2x" />
					</Button>
					<label>Settings</label>
				</div>
			</div>

			<div className="bestiary">
				<div className="bestiary-head-container">
					<h1 className="bestiary-heading">Bestiary</h1>
				</div>
				<div className="bestiary-container">
					{/* Replace the "under construction" text with the actual component */}
					<BestiaryComponent />
				</div>
			</div>

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
