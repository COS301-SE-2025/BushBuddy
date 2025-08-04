import React, { useState } from 'react';
import './Layout.css';
import SettingsModal from './SettingsModal';
import { Container, Navbar, Button } from 'react-bootstrap';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaMapMarkedAlt, FaCamera, FaRegNewspaper, FaUser, FaCog} from 'react-icons/fa';

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);


  const getHeaderText = () => {
    switch (path) {
      case '/home': 
          return 'Bush Buddy';
      case '/map':
          return 'Map View';
      case '/capture':
          return 'Buddy Scanner';
      case '/feed':
          return 'Sightings Feed';
      case '/profile':
          return 'My Profile';
      default: return 'BushBuddy';
    }
  };

  const showSettingsIcon = ['/profile'].includes(path);

return (
    <div className="layout-wrapper">
      <Navbar fixed="top" className="header">
        <img 
          src={require("../assets/BushBuddy.webp")}
          alt="App Icon"
          className="header-icon"
        />
        <Navbar.Brand className="header-brand">
          {getHeaderText()}
        </Navbar.Brand>

        {
            showSettingsIcon ? (
              <div
                className="header-settings-icon"
                onClick={() => setShowSettings(true)}
              >
                <FaCog size={28} color="#FFFFFF" />
              </div>
            ) : (
              <div 
                className="header-profile-icon"
                onClick={() => navigate('/profile')}
              >
                <img 
                  src={require("../assets/Jean-Steyn-ProfilePic.jpg")}
                  alt="Profile"
                  className="header-profile-img"
                />
              </div>
            )
          }
      </Navbar>

      <Container className="main-content">
        <Outlet />
      </Container>

      <Navbar className="footer">
        <Button className={`nav-button-home ${path === '/main' ? 'active' : ''}`} onClick={() => navigate('/main')}>
          <FaHome size={'1.5rem'} />
          <span className="nav-label">Home</span>
        </Button>

        <Button className={`nav-button-map ${path === '/map' ? 'active' : ''}`} onClick={() => navigate('/map')}>
          <FaMapMarkedAlt size={'1.5rem'} />
          <span className="nav-label">Map</span>
        </Button>

        <Button className="nav-button-scanner" onClick={() => navigate('/capture')}>
          <FaCamera size={'1.5rem'} />
        </Button>

        <Button className={`nav-button-feed ${path === '/feed' ? 'active' : ''}`} onClick={() => navigate('/feed')}>
          <FaRegNewspaper size={'1.5rem'} />
          <span className="nav-label">Feed</span>
        </Button>

        <Button className={`nav-button-profile ${path === '/profile' ? 'active' : ''}`} onClick={() => navigate('/profile')}>
          <FaUser size={'1.3rem'} />
          <span className="nav-label-profile">Profile</span>
        </Button>
      </Navbar>
      <SettingsModal
        show={showSettings}
        onClose={() => setShowSettings(false)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(dm => !dm)}
      />
    </div>
  );
}

export default Layout;
