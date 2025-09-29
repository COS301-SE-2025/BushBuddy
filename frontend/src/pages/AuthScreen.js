import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthScreen.css';
import Logo from '../assets/EpiUseLogo.png';
import BushBuddy from '../assets/BushBuddy.webp';
import { FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import VideoBackground from '../components/VideoBackground';
import { handleLogin, checkAuthStatus } from '../controllers/UsersController';
import { useLoading } from '../contexts/LoadingContext';

const AuthScreen = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');
	const { startLoading, stopLoading } = useLoading();

	useEffect(() => {
		const checkLogin = async () => {
			startLoading();

			try {
				const result = await checkAuthStatus();

				if (!result) return; //do nothing
				navigate('/main');
			} finally {
				stopLoading();
			}
		};

		checkLogin();
	}, []);

	const handleToggle = () => {
		setShowPassword((prev) => !prev);
	};

	async function onSubmit(e) {
		e.preventDefault();
		startLoading();

		try {
			startLoading();
			const result = await handleLogin(username, password);

			if (result.success) {
				navigate('/main');
			} else {
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
					<h1 className="auth-title-text">Login</h1>
					<img src={BushBuddy} alt="BushBuddy" className="bb-logo" />
				</div>

				<form className="login-form" onSubmit={onSubmit}>
					<div className="input-icon-wrapper">
						<input
							type="text"
							onChange={(e) => setUsername(e.target.value)}
							placeholder="Username"
							value={username}
							required
						/>
						<span className="input-icon">
							<FaUser></FaUser>
						</span>
					</div>
					{/* {errors.email && <span style={{ color: "red" }}>*Email* is mandatory</span>} */}

					<div className="input-icon-wrapper">
						<input
							type={showPassword ? 'text' : 'password'}
							value={password}
							placeholder="Password"
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						<span className="input-icon" onClick={handleToggle} role="button" tabIndex={0}>
							{showPassword ? <FaEyeSlash size={20} /> : <FaEye size={25} />}
						</span>
					</div>
					{/* {errors.password && <span style={{ color: "red" }}>*Password* is mandatory</span>} */}

					{/* Uncomment this when functionality is implemented */}
					{/* <div className="options-row">
            <label className="remember-me">
              <input type="checkbox" />
              Remember me
            </label>

            <a href="/forgot-password">Forgot password?</a>
          </div> */}

					{error && (
						<p className="register-link">
							{error}
						</p>
					)}

					<button type="submit" className="auth-button">
						Login
					</button>
				</form>

				<p className="register-link">
					Need an account? <a href="/register">Register</a>
				</p>
			</div>
		</div>
	);
};

export default AuthScreen;
