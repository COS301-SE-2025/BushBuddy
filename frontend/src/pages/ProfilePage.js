import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import ProfileHeader from '../components/ProfileHeader.jsx';
import ActivityStatsCard from '../components/ActivityStatsCard.jsx';
import AchievementsCard from '../components/AchievementsCard.jsx';
import SettingsSection from '../components/SettingsSection';

const ProfilePage = () => {
	const navigate = useNavigate();

	/* const handleLogout = async () => {
    try {
      const baseUrl = process.env.REACT_APP_API_URL || '';
      
      // Use relative URLs that work in both development and production (important because it worked just on localhost)
      const possibleUrls = [
        `${baseUrl}/api/auth/logout`,
        `${baseUrl}/auth/logout`, 
        `${baseUrl}/logout`
      ];

      let response;
      let lastError;

      // Try each URL until one works
      for (const url of possibleUrls) {
        try {
          console.log('Trying logout URL:', url);
          response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
          
          if (response.ok) {
            console.log('Logout request successful with URL:', url);
            break;
          } else {
            console.log(`URL ${url} returned status:`, response.status);
          }
        } catch (err) {
          console.log(`URL ${url} failed:`, err.message);
          lastError = err;
          continue;
        }
      }

      if (!response || !response.ok) {
        console.error(`All logout URLs failed. Last error: ${lastError?.message || 'Unknown error'}`);
      }

      // Always logout on frontend regardless of server response
      console.log('Logging out user and redirecting...');
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');

    } catch (error) {
      console.error('Error during logout:', error);
      
      // Always logout on frontend even if server call fails
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');
    }
  }; */

	const handleLogout = async () => {
		try {
			const result = await fetch('/api/auth/logout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});
			if (result.ok) {
				window.sessionStorage.clear();
				window.dispatchEvent(new Event('profileCleared'));
				navigate('/login');
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="profile-page">
			<ProfileHeader />
			{/*<ActivityStatsCard />
      <AchievementsCard />*/}
			<SettingsSection onLogout={handleLogout} />
		</div>
	);
};

export default ProfilePage;
