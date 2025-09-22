import { profileRepo } from './profileRepository';

async function updateUserPreferences(user, preferences) {
	if (preferences.theme) {
		return await profileRepo.updateThemePreference(user, preferences.theme);
	} else if (preferences.notifications) {
		return await profileRepo.updateNotificationPreference(user, preferences.notifications);
	} else if (preferences.location) {
		return await profileRepo.updateLocationPreference(user, preferences.location);
	}

	return 'INVALID_PARAMETERS';
}

export const profileService = {
	updateUserPreferences,
};
