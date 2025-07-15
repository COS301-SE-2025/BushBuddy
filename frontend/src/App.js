// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthScreen from './pages/AuthScreen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthScreen />} />
        {/* other screens come here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
