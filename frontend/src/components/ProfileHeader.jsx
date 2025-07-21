import React from 'react';
import { FaMapMarkerAlt, FaCamera, FaPen } from 'react-icons/fa';
import './ProfileHeader.css';

const ProfileHeader = () => {
  return (
    <div className="profile-header">
      <div className="profile-header-row">
        <div className="profile-pic-container">
          <img
            src={require("../assets/Jean-Steyn-ProfilePic.jpg")}
            alt="Profile"
            className="profile-pic"
          />
          <div className="camera-icon">
            <FaCamera color="#fff" size={14} />
          </div>
        </div>

        <div className="profile-details">
          <h3>Jean Steyn</h3>
          <p className="role">Wildlife Researcher</p>
          <p className="location">
            <FaMapMarkerAlt size={12} style={{ marginRight: 4 }} />
            Kruger National Park
          </p>
          <p className="member">Member since January 2025</p>
        </div>
      </div>
      <hr className="profile-header-hr" />

      <p className="profile-header-bio">
        Passionate about wildlife conservation and research. <br />
        Dedicated to protecting endangered species in South Africa.
      </p>

      <div className="profile-header-btn-row">
        <button 
          className="profile-header-btn"
          onClick={() => alert('/edit-profile')}
        >
          Edit Profile <FaPen />
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;