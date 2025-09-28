import { profileService } from './profileService.js';

async function updateUserPreferences(req, res) {
	try {
		const user_id = req.user.id;
		const { preferences } = req.body;

		const result = await profileService.updateUserPreferences(user_id, preferences);

		if (result === 'DB_ERROR') {
			return res.status(500).json({ success: false, message: 'Internal Database Error' });
		} else if (result === 'INVALID_PARAMETERS') {
			return res.status(400).json({ success: false, message: 'One or more required parameters are missing' });
		} else if (result === 'PREFERENCES_SET') {
			return res.status(200).json({ success: true, message: 'Successfully updated preferences' });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
}

async function fetchUserPreferences(req, res) {
	const user_id = req.user.id;

	const result = await profileService.fetchUserPreferences(user_id);

	if (result === 'DB_ERROR') {
		return res.status(500).json({ success: false, message: 'Internal Database Error' });
	} else if (result === 'PREFERENCES_NOT_SET') {
		return res.status(200).json({
			success: true,
			message: 'Retrieved user preferences',
			data: { preferences: { theme: 'light', notifications: false, location: false } },
		});
	} else {
		return res.status(200).json({
			success: true,
			message: 'Retrieved user preferences',
			data: { preferences: result },
		});
	}
}

async function fetchProfile(req, res) {
	try {
		const { id, username, email } = req.user;

		const result = await profileService.fetchUserProfile(id);

		if (result === 'ACCOUNT_DOES_NOT_EXIST' || result === 'DB_ERROR') {
			return res.status(400).json({ success: false, message: 'Failed to fetch user profile' });
		}

		const data = {
			username: username,
			email: email,
			role: result.role,
			bio: result.bio,
			image: result.image,
		};

		return res.status(200).json({ success: true, message: 'User profile fetched', data: data });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
}

async function updateProfile(req, res) {
	try {
		const user = req.user.id;
		const { role, bio } = req.body;
		let image = null;
		if (req.file) {
			image = req.file.buffer;
		}

		const result = await profileService.updateUserProfile(user, image, role, bio);

		if (result === 'DB_ERROR' || result === 'STORAGE_ERROR') {
			return res.status(400).json({ success: false, message: 'Failed to update user profile' });
		} else if (result === 'IMAGE_STORAGE_ERROR') {
			return res.status(400).json({ success: false, message: 'Failed to update profile image' });
		} else {
			return res.status(200).json({ success: true, message: 'Updated user profile' });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
}

export const profileController = {
	updateUserPreferences,
	fetchUserPreferences,
	fetchProfile,
	updateProfile,
};
