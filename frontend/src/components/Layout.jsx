import React from 'react';
import './Layout.css';
import { Container, Navbar, Button } from 'react-bootstrap';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaMapMarkedAlt, FaCamera, FaRegNewspaper, FaUser } from 'react-icons/fa';

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const getHeaderText = () => {
    switch (location.pathname) {
      case '/home': return 'Bush Buddy';
      case '/map': return 'Map';
      case '/capture': return 'Buddy Scanner';
      case '/feed': return 'Sightings Feed';
      case '/profile': return 'Your Profile';
      default: return 'BushBuddy';
    }
  };

  return (
    <>
      <div className="layout-wrapper">
        <Navbar fixed="top" className="header" sticky='top'>
          <Navbar.Brand>{getHeaderText()}</Navbar.Brand>
        </Navbar>

        <Container className="main-content">
          <Outlet />
        </Container>

        <Navbar className="footer" sticky="bottom">
          <Button
            className={`nav-button ${currentPath === '/main' ? 'active-nav' : ''}`}
            onClick={() => navigate('/main')}
          >
            <FaHome size={30} />
          </Button>

          <Button
            className={`nav-button ${currentPath === '/map' ? 'active-nav' : ''}`}
            onClick={() => navigate('/map')}
          >
            <FaMapMarkedAlt size={30} />
          </Button>

          <div style={{ width: '50px' }}></div>

          <Button
            className={`nav-button-scanner ${currentPath === '/capture' ? 'active-nav-scanner' : ''}`}
            onClick={() => navigate('/capture')}
          >
            <FaCamera size={30} />
          </Button>

          <Button
            className={`nav-button ${currentPath === '/feed' ? 'active-nav' : ''}`}
            onClick={() => navigate('/feed')}
          >
            <FaRegNewspaper size={30} />
          </Button>

          <Button
            className={`nav-button ${currentPath === '/profile' ? 'active-nav' : ''}`}
            onClick={() => navigate('/profile')}
          >
            <FaUser size={25} />
          </Button>
        </Navbar>

      </div>
    </>
  );
}

export default Layout;
