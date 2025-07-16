// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthScreen from './pages/AuthScreen';
import MainScreen from './pages/MainScreen';
import MapPage from './pages/MapPage';
import CapturePage from './pages/CapturePage';
import FeedScreen from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthScreen />} />
        <Route path="/main" element={<MainScreen />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/capture" element={<CapturePage />} />
        <Route path="/feed" element={<FeedScreen />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
