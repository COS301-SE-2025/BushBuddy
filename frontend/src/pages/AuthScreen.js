import React from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import './AuthScreen.css';
import Logo from '../assets/EpiUseLogo.png';
import BushBuddy from '../assets/BushBuddy.webp';
import { FaUser, FaLock } from 'react-icons/fa';
import VideoBackground from '../components/VideoBackground';

const AuthScreen = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    navigate('/main');  // remove this when login works

    const userData = JSON.parse(localStorage.getItem(data.email));
    if (userData) {
      if (userData.password === data.password) {
        console.log(userData.name + " You Are Successfully Logged In");
        navigate('/main');
      } else {
        console.log("Email or Password is not matching with our record");
      }
    } else {
      console.log("Email or Password is not matching with our record");
    }
  };

  return (
    <div className="auth-container">
      <VideoBackground />
      <div className="auth-form">

          <div className="auth-header">
            <img src={Logo} alt="Epi-Use Logo" className="epi-use-logo" />
            <h1 className="auth-title-text">
              Login
            </h1>
            <img src={BushBuddy} alt="BushBuddy" className="bb-logo"/>
          </div>

          <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="input-icon-wrapper">
              <input
                type="email"
                {...register("email", { required: true })}
                placeholder="Username"
              />
              <span className="input-icon"><FaUser></FaUser></span>
            </div>
            {/* {errors.email && <span style={{ color: "red" }}>*Email* is mandatory</span>} */}

            <div className="input-icon-wrapper">
              <input
                type="password"
                {...register("password", { required: true })}
                placeholder="Password"
              />
              <span className="input-icon"><FaLock></FaLock></span>
            </div>
            {/* {errors.password && <span style={{ color: "red" }}>*Password* is mandatory</span>} */}
            
            <div className="options-row">
              <label className="remember-me">
                <input type="checkbox" />
                Remember me
              </label>

              <a href="/forgot-password">Forgot password?</a>
            </div>

            <button type="submit" className="auth-button">Login</button>
          </form>

        <p className="register-link">Need an account? <a href="/register">Register</a></p>
      </div>
    </div>
  );
};

export default AuthScreen;
