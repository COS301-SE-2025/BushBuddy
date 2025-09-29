import React, { useState } from 'react';
import './SettingsSection.css';
import PopUpModal from './PopUpModal';
import ChangePasswordModal from './ChangePasswordModal';

import { FaEnvelope, FaLock, FaQuestionCircle, FaInfoCircle, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SettingsSection = ({ onLogout }) => {
	const [showPopup, setShowPopup] = useState(false);
	const [showChangePassword, setShowChangePassword] = useState(false);
	const navigate = useNavigate();

	const handleSupport = () => {
		window.location.href = 'mailto:g24capstone@gmail.com';
	};

	return (
		<div className="settings-section">
			<div className="settings-section-title">Account</div>
			<div className="settings-list">
				{/* <div className="settings-row" tabIndex={0} role="button" onClick={() => setShowPopup(true)}>
					<FaEnvelope className="settings-icon" />
					<span>Change Email</span>
					<span className="settings-arrow">{'>'}</span>
				</div> */}
				<div className="settings-row" tabIndex={0} role="button" onClick={() => setShowChangePassword(true)}>
					<FaLock className="settings-icon" />
					<span>Change Password</span>
					<span className="settings-arrow">{'>'}</span>
				</div>
				<div className="settings-row" tabIndex={0} role="button" onClick={handleSupport}>
					<FaQuestionCircle className="settings-icon" />
					<span>Help & Support</span>
					<span className="settings-arrow">{'>'}</span>
				</div>
				<div className="settings-row" tabIndex={0} role="button" onClick={() => navigate('/about')}>
					<FaInfoCircle className="settings-icon" />
					<span>About App</span>
					<span className="settings-arrow">{'>'}</span>
				</div>
			</div>
			<button className="logout-btn" onClick={onLogout}>
				<FaSignOutAlt style={{ marginRight: 8 }} />
				Logout
			</button>
			<PopUpModal show={showPopup} onClose={() => setShowPopup(false)} />
			{showChangePassword && (
				<ChangePasswordModal
					onClose={() => setShowChangePassword(false)}
					onSubmit={(e) => {
						e.preventDefault();
						setShowChangePassword(false);
					}}
				/>
			)}
		</div>
	);
};

export default SettingsSection;
