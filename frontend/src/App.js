// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthScreen from './pages/AuthScreen';
import MainScreen from './pages/MainScreen';
import MapPage from './pages/MapPage';
import CapturePage from './pages/CapturePage';
import FeedScreen from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage'
import Layout from './components/Layout';
import React, {useEffect} from 'react';
import { downloadModel } from './utility/modelStorageOperations';

function App() {
  useEffect(() => {
    downloadModel().catch(err => {
      console.error("Failed to download model on launch:", err);
    });
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout /> }>
          <Route path="/main" element={<MainScreen />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/capture" element={<CapturePage />} />
          <Route path="/feed" element={<FeedScreen />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="/login" element={<AuthScreen />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
