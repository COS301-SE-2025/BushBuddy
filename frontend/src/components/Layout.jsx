import React, { useState } from 'react';
import './Layout.css';
import SettingsModal from './SettingsModal';
import HelpModal from './HelpModal';
import { Container, Navbar, Button } from 'react-bootstrap';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaMapMarkedAlt, FaCamera, FaRegNewspaper, FaUser, FaCog, FaQuestionCircle} from 'react-icons/fa';

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [showHelp, setShowHelp] = useState(false);
  const [helpText, setHelpText] = useState('');

  const getHeaderText = () => {
    switch (path) {
      case '/main': 
          return 'BushBuddy';
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

  const getHelpText = () => {
    switch (path) {
      case '/main':
        return [
          `This is the Home page, you can view all animals in our database and interesting facts about them by 
            clicking on the animal.`,
          `You can also filter and search for specific animals using the filters provided. Using the quick 
            actions you can navigate quickly to the mentioned sections, such as creating a new detection or even 
            viewing the map.`,
          `At the bottom of the page you can find the navbar that takes you to the other main pages of the app.`
        ];
      case '/map':
        return [
          `This is the Map page to locate real-time nearby sightings and find out more about specific 
            sightings by tapping on the marker.`,
          `Different markers represent different types of animals sighted, such as an elephant, or bird, etc.`
        ];
      case '/capture':
        return [
          `This is the Buddy Scanner page, where you can capture images of animals and upload them for identification, 
            or identify them in real time using AI. (Support for this feature is dependent on your device's capabilities.)`,
          `Once you upload the image, you will be presented with a page where you can create a post/sighting that 
            can be shared to other users`
        ];
      case '/feed':
        return [
          `Browse the latest sightings posted by the community. You can filter the feed by friends, following or even 
            animal type or location.`,
          `You are able to interact with posts by liking, commenting, and sharing them.`
        ];
      case '/profile':
        return 'Manage your account, view your statistics and achievements, and update preferences.';
      default:
        return 'Welcome to BushBuddy!';
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

        <div className="help-div">
          <div
            className="help-section"
            onClick={() => {
              setHelpText(getHelpText());
              setShowHelp(true);
            }}
          >
            <FaQuestionCircle size={'1.5rem'} />
          </div>
        </div>
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
      <HelpModal 
        show={showHelp} 
        onClose={() => setShowHelp(false)} 
        helpText={helpText}
      />
    </div>
  );
}

export default Layout;
