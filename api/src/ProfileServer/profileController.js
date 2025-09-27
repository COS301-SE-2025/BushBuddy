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

export const profileController = {
	updateUserPreferences,
	fetchUserPreferences,
};
