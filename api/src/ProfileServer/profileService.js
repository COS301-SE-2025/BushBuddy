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

export const profileService = {
	updateUserPreferences,
};
