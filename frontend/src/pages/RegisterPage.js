import React from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';
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
    navigate('/login');  // remove this when login works

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
              Register
            </h1>
            <img src={BushBuddy} alt="BushBuddy" className="bb-logo"/>
          </div>

          <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="input-icon-wrapper">
              <input
                type="text"
                {...register("username", { required: true })}
                placeholder="Username"
              />
              <span className="input-icon"><FaUser></FaUser></span>
            </div>
            {/* {errors.email && <span style={{ color: "red" }}>*UserName* is mandatory</span>} */}

            <div className="input-icon-wrapper">
              <input
                type="email"
                {...register("email", { required: true })}
                placeholder="Email"
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
        
            <button type="submit" className="auth-button">Register</button>
          </form>
      </div>
    </div>
  );
};

export default AuthScreen;
