import React from 'react';
import './SettingsModal.css';

const SettingsModal = ({ 
    show, onClose, 
    darkMode, onToggleDarkMode, 
    notifications, onToggleNotifications,
    locationTracking, onToggleLocation }) => {
  if (!show) return null;

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={e => e.stopPropagation()}>
        <h2>App Settings</h2>
            <div className="settings-list">
            <div className="settings-item">
                <span>Dark Mode</span>
                <label className="switch">
                <input type="checkbox" checked={darkMode} onChange={onToggleDarkMode} />
                <span className="slider"></span>
                </label>
            </div>
            <div className="settings-item">
                <span>Notifications</span>
                <label className="switch">
                <input type="checkbox" checked={notifications} onChange={onToggleNotifications} />
                <span className="slider"></span>
                </label>
            </div>
            <div className="settings-item">
                <span>Location Tracking</span>
                <label className="switch">
                <input type="checkbox" checked={locationTracking} onChange={onToggleLocation} />
                <span className="slider"></span>
                </label>
            </div>
        </div>
        <button className="settings-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SettingsModal;