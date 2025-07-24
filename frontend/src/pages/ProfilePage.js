import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import ProfileHeader from '../components/ProfileHeader.jsx';
import ActivityStatsCard from '../components/ActivityStatsCard.jsx';
import AchievementsCard from '../components/AchievementsCard.jsx';
import SettingsSection from '../components/SettingsSection';

const ProfilePage = () => {
  return (
    <div className="profile-page">
      <ProfileHeader />
      <ActivityStatsCard />
      <AchievementsCard />
      <SettingsSection onLogout={() => alert('Logged out!')} />
    </div>
  );
};

export default ProfilePage;