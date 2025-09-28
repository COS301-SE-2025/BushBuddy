import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';
import Logo from '../assets/EpiUseLogo.png';
import BushBuddy from '../assets/BushBuddy.webp';
import { FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import VideoBackground from '../components/VideoBackground';

import { checkAuthStatus, handleRegister } from '../controllers/UsersController';
import { useLoading } from '../contexts/LoadingContext';

const AuthScreen = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();


  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleToggle = () => {
    setShowPassword((prev) => !prev);
  };

  async function onSubmit(e) {
    e.preventDefault();

    startLoading();
    try {

      const result = await handleRegister(username, email, password);

      if (result.success) {
        navigate("/main");
      } else {

        const isLoggedIn = await checkAuthStatus();
        if (isLoggedIn)
          navigate("/main");

        setError(result.message);
      }

    } finally {
      stopLoading();
    }
  }

  return (
    <div className="auth-container">
      <VideoBackground />
      <div className="auth-form">

        <div className="auth-header">
          <img src={Logo} alt="Epi-Use Logo" className="epi-use-logo" />
          <h1 className="auth-title-text">
            Register
          </h1>
          <img src={BushBuddy} alt="BushBuddy" className="bb-logo" />
        </div>

        <form className="login-form" onSubmit={onSubmit}>
          <div className="input-icon-wrapper">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <span className="input-icon"><FaUser></FaUser></span>
          </div>
          {/* {errors.email && <span style={{ color: "red" }}>*UserName* is mandatory</span>} */}

          <div className="input-icon-wrapper">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="input-icon"><FaUser></FaUser></span>
          </div>
          {/* {errors.email && <span style={{ color: "red" }}>*Email* is mandatory</span>} */}

          <div className="input-icon-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className='input-icon'
              onClick={handleToggle}
              role="button"
              tabIndex={0}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={25} />}
            </span>
          </div>
          {/* {errors.password && <span style={{ color: "red" }}>*Password* is mandatory</span>} */}

          {error && <p className="register-link">{error}</p>}

          <button type="submit" className="auth-button">Register</button>
        </form>

        <p className="register-link">
          Have an account? <a href="/login">Log in</a>
        </p>

      </div>
    </div>
  );
};

export default AuthScreen;