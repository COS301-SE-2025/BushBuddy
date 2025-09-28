import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaCamera, FaPen } from 'react-icons/fa';
import './ProfileHeader.css';
import PopUpModal from './PopUpModal';
import ProfileEditModal from './ProfileEditModal';
import { useLoading } from '../contexts/LoadingContext';

const ProfileHeader = () => {
	const [showPopup, setShowPopup] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [userData, setUserData] = useState(
		sessionStorage.getItem('profile')
			? sessionStorage.getItem('profile')
			: {
					role: 'Wildlife Enthusiast',
					bio: 'Nature enthusiast exploring the world of wildlife, one discovery at a time.',
					image: 'https://www.gravatar.com/avatar/?s=40&d=mp',
					username: 'User',
			  }
	);
	const { startLoading, stopLoading } = useLoading();

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await fetch('/api/user/profile', {
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
				});
				const data = await response.json();
				if (response.ok) {
					window.sessionStorage.setItem('profile', JSON.stringify(data.data));
					setUserData(data.data);
				}
			} catch (error) {
				console.error(error);
			}
		};

		fetchProfile();
	}, []);

	const handleProfileEdit = async (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);

		try {
			startLoading();
			const res = await fetch('/api/user/profile', {
				method: 'POST',
				body: formData,
				credentials: 'include',
			});

			if (res.ok) {
				setShowEdit(false);
				setTimeout(() => {
					window.location.reload();
				}, 500);
			}
		} catch (error) {
			console.error(error);
		} finally {
			stopLoading();
		}
	};

	return (
		<div className="profile-header">
			<div className="profile-header-row">
				<div className="profile-pic-container">
					<img
						src={userData.image}
						alt="Profile"
						className="profile-pic"
						onError={(e) => {
							e.target.onerror = null;
							e.target.src = `https://www.gravatar.com/avatar/?s=40&d=mp`;
						}}
					/>
					{/* <div className="camera-icon">
						<FaCamera color="#fff" size={14} />
					</div> */}
				</div>

				<div className="profile-details">
					<h3>{userData.username}</h3>
					<p className="role">{userData.role}</p>
					{/* <p className="location">
						<FaMapMarkerAlt size={12} style={{ marginRight: 4 }} />
						Kruger National Park
					</p> */}
					{/* <p className="member">Member since January 2025</p> */}
				</div>
			</div>
			<hr className="profile-header-hr" />

			<p className="profile-header-bio">{userData.bio}</p>

			<div className="profile-header-btn-row">
				<button className="profile-header-btn" onClick={() => setShowEdit(true)}>
					Edit Profile <FaPen />
				</button>
			</div>
			<PopUpModal show={showPopup} onClose={() => setShowPopup(false)} />
			<ProfileEditModal show={showEdit} onClose={() => setShowEdit(false)} onSubmit={handleProfileEdit} />
		</div>
	);
};

export default ProfileHeader;
