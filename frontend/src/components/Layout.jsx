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
        <Button className="nav-button" onClick={() => navigate('/main')}>
          <FaHome size={30} />
        </Button>

        <Button className="nav-button" onClick={() => navigate('/map')}>
          <FaMapMarkedAlt size={30} />
        </Button>

        <Button className="nav-button" onClick={() => navigate('/capture')}>
          <FaCamera size={30} />
        </Button>

        <Button className="nav-button" onClick={() => navigate('/feed')}>
          <FaRegNewspaper size={30} />
        </Button>

        <Button className="nav-button" onClick={() => navigate('/profile')}>
          <FaUser size={25} />
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
