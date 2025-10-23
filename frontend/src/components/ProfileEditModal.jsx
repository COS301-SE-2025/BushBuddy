import { useRef, useState, useEffect } from 'react';
import './ProfileEditModal.css';

export default function ProfileEditModal({ show, onClose, onSubmit }) {
	const containerRef = useRef(null);
	const [preview, setPreview] = useState(null);
	const [userData, setUserData] = useState({ role: 'Enter your role', bio: 'Write a short bio about yourself...' });

	useEffect(() => {
		setUserData(JSON.parse(sessionStorage.getItem('profile')));
	}, []);

	if (!show) return null;

	// Close modal when clicking outside container
	const handleBackgroundClick = (e) => {
		if (containerRef.current && !containerRef.current.contains(e.target)) {
			onClose();
		}
	};

	// Handle image upload preview
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => setPreview(reader.result);
			reader.readAsDataURL(file);
		}
	};

	console.log(userData);

	return (
		<div className="edit-profile-background" onClick={handleBackgroundClick}>
			<div ref={containerRef} className="edit-profile-container">
				<button className="edit-profile-close" onClick={onClose}>
					&times;
				</button>
				<h3>Edit Profile</h3>
				<form className="edit-profile-content" onSubmit={onSubmit}>
					<div className="edit-profile-image">
						<label htmlFor="profileImage">
							{preview ? (
								<img src={preview} alt="Profile preview" className="edit-profile-preview" />
							) : (
								<div className="edit-profile-placeholder">+</div>
							)}
						</label>
						<input
							type="file"
							id="profileImage"
							accept="image/*"
							name="profileImage"
							onChange={handleImageChange}
							style={{ display: 'none' }}
						/>
					</div>

					<div className="edit-profile-role">
						<label>
							Role:
							<input type="text" name="role" placeholder="Enter your role" value={userData.role} />
						</label>
					</div>

					<div className="edit-profile-bio">
						<label>
							Bio:
							<textarea name="bio" placeholder="Write a short bio about yourself..." rows="4" value={userData.bio} />
						</label>
					</div>

					<button type="submit" className="edit-profile-submit">
						Save Changes
					</button>
				</form>
			</div>
		</div>
	);
}
