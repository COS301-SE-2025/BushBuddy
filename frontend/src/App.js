import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthScreen from './pages/AuthScreen';
import MainScreen from './pages/MainScreen';
import MapPage from './pages/MapPage';
import CapturePage from './pages/CapturePage';
import FeedScreen from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './pages/error_pages/404_Page';
import { LoadingProvider } from "./contexts/LoadingContext";
import GlobalSpinner from './components/LoadingSpinner';

function App() {
  return (
    <LoadingProvider>
      <GlobalSpinner />

      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route
              path="/main"
              element={
                <ProtectedRoute> <MainScreen /> </ProtectedRoute>
              }
            />

            <Route
              path="/map"
              element={
                <ProtectedRoute> <MapPage /> </ProtectedRoute>
              }
            />

            <Route
              path="/capture"
              element={
                <ProtectedRoute> <CapturePage /> </ProtectedRoute>
              }
            />

            <Route
              path="/feed"
              element={
                <ProtectedRoute> <FeedScreen /> </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute> <ProfilePage /> </ProtectedRoute>
              }
            />

          </Route>
          <Route path="/login" element={<AuthScreen />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </LoadingProvider>

  );
}

export default App;
