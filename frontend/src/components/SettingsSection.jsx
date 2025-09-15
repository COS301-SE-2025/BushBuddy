import React, { useState } from 'react';
import './SettingsSection.css';
import PopUpModal from './PopUpModal';

import { FaEnvelope, FaLock, FaQuestionCircle, FaInfoCircle, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SettingsSection = ({ onLogout }) => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="settings-section">
      <div className="settings-section-title">Account</div>
      <div className="settings-list">
        <div className="settings-row" tabIndex={0} role="button" onClick={() => setShowPopup(true)}>
          <FaEnvelope className="settings-icon" />
          <span>Change Email</span>
          <span className="settings-arrow">{'>'}</span>
        </div>
        <div className="settings-row" tabIndex={0} role="button" onClick={() => setShowPopup(true)}>
          <FaLock className="settings-icon" />
          <span>Change Password</span>
          <span className="settings-arrow">{'>'}</span>
        </div>
        <div className="settings-row" tabIndex={0} role="button" onClick={() => setShowPopup(true)}>
          <FaQuestionCircle className="settings-icon" />
          <span>Help & Support</span>
          <span className="settings-arrow">{'>'}</span>
        </div>
        <div className="settings-row" tabIndex={0} role="button" onClick={() => navigate("/about")}>
          <FaInfoCircle className="settings-icon" />
          <span>About App</span>
          <span className="settings-arrow">{'>'}</span>
        </div>
      </div>
      <button className="logout-btn" onClick={() => setShowPopup(true)}>
        <FaSignOutAlt style={{ marginRight: 8 }} />
        Logout
      </button>
      <PopUpModal 
        show={showPopup} 
        onClose={() => setShowPopup(false)}
      />
    </div>
  );
};

export default SettingsSection;