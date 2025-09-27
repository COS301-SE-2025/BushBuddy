import { profileRepo } from './profileRepository.js';

async function updateUserPreferences(user, preferences) {
	console.log('Service layer: ', user, preferences);
	if (preferences.theme) {
		return await profileRepo.updateThemePreference(user, preferences.theme);
	} else if (preferences.notifications !== null) {
		return await profileRepo.updateNotificationPreference(user, preferences.notifications);
	} else if (preferences.location !== null) {
		return await profileRepo.updateLocationPreference(user, preferences.location);
	}

	return 'INVALID_PARAMETERS';
}

async function fetchUserPreferences(user) {
	const preferences = await profileRepo.fetchUserPreferences(user);

	if (preferences === 'PREFERENCES_NOT_SET') return preferences;

	if (preferences.theme === null) {
		preferences.theme = 'light';
	}
	if (preferences.enable_notifications === null) {
		preferences.enable_notifications = false;
	}
	if (preferences.enable_location === null) {
		preferences.enable_location = false;
	}
	return preferences;
}

export const profileService = {
	updateUserPreferences,
	fetchUserPreferences,
};
