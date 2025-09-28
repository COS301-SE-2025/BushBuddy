import './ChangePasswordModal.css';

import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ChangePasswordModal({ onClose, onSubmit }) {
	const [showPassword, setShowPassword] = useState({
		current: false,
		new: false,
		confirm: false,
	});

	const [formValues, setFormValues] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	const [message, setMessage] = useState(''); // feedback to user
	const [messageType, setMessageType] = useState('error'); // "error" | "success"

	const [loading, setLoading] = useState(false);

	const togglePassword = (field) => {
		setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
	};

	const handleChange = (e) => {
		setFormValues({ ...formValues, [e.target.name]: e.target.value });
	};

	// Basic password strength check
	const isStrongPassword = (password) => {
		const minLength = 8;
		const hasNumber = /\d/;
		const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/;
		return password.length >= minLength && hasNumber.test(password) && hasSpecial.test(password);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const { currentPassword, newPassword, confirmPassword } = formValues;
		setLoading(true);
		// console.log(formValues);

		// validation rules
		if (newPassword === currentPassword) {
			setMessage('New password cannot be the same as the current password.');
			setMessageType('error');
			setLoading(false);
			return;
		}

		if (newPassword !== confirmPassword) {
			setMessage('New password and confirm password do not match.');
			setMessageType('error');
			setLoading(false);
			return;
		}

		if (!isStrongPassword(newPassword)) {
			setMessage('Password must be at least 8 characters long and include a number and a special character.');
			setMessageType('error');
			setLoading(false);
			return;
		}

		// setMessage('Password looks good. Submitting...');
		// setMessageType('success');
		try {
			const result = await fetch('/api/auth/password', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formValues),
			});
			const data = await result.json();
			// console.log(data);
			setMessage(data.message);
			if (result.ok) {
				setMessageType('success');
				setTimeout(() => {
					onClose();
				}, 2000);
			} else {
				setMessageType('error');
			}
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		if (loading) return;
		onClose();
	};

	return (
		<div className="change-password-modal-background">
			<div className="change-password-modal-content">
				<h3>Change Password</h3>
				<div className="change-password-modal-close" onClick={handleClose}>
					&times;
				</div>
				<form className="change-password-modal-form" onSubmit={handleSubmit}>
					{/* Current Password */}
					<div className="change-password-modal-input">
						<label htmlFor="current-password">Current Password</label>
						<div className="password-wrapper">
							<input
								type={showPassword.current ? 'text' : 'password'}
								id="current-password"
								name="currentPassword"
								value={formValues.currentPassword}
								onChange={handleChange}
								required
								minLength="1"
								autoComplete="current-password"
							/>
							<span className="password-toggle-icon" onClick={() => togglePassword('current')}>
								{showPassword.current ? <FaEyeSlash /> : <FaEye />}
							</span>
						</div>
					</div>

					{/* New Password */}
					<div className="change-password-modal-input">
						<label htmlFor="new-password">New Password</label>
						<div className="password-wrapper">
							<input
								type={showPassword.new ? 'text' : 'password'}
								id="new-password"
								name="newPassword"
								value={formValues.newPassword}
								onChange={handleChange}
								required
								minLength="8"
								autoComplete="new-password"
							/>
							<span className="password-toggle-icon" onClick={() => togglePassword('new')}>
								{showPassword.new ? <FaEyeSlash /> : <FaEye />}
							</span>
						</div>
					</div>

					{/* Confirm Password */}
					<div className="change-password-modal-input">
						<label htmlFor="confirm-password">Confirm New Password</label>
						<div className="password-wrapper">
							<input
								type={showPassword.confirm ? 'text' : 'password'}
								id="confirm-password"
								name="confirmPassword"
								value={formValues.confirmPassword}
								onChange={handleChange}
								required
								minLength="8"
								autoComplete="new-password"
							/>
							<span className="password-toggle-icon" onClick={() => togglePassword('confirm')}>
								{showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
							</span>
						</div>
					</div>

					{message && (
						<p className={`change-password-message ${messageType === 'error' ? 'error' : 'success'}`}>{message}</p>
					)}

					{/* Submit */}
					<button type="submit" className="change-password-modal-submit" disabled={loading}>
						{loading ? 'Submitting...' : 'Change Password'}
					</button>
				</form>
			</div>
		</div>
	);
}
