import db from '../db/index.js';

async function updateThemePreference(user, preference) {
	let query = '';
	if (await userPreferencesExist(user)) {
		query = 'UPDATE user_preferences SET theme=$2 WHERE id=$1;';
	} else {
		query = 'INSERT INTO user_preferences (id, theme) VALUES ($1, $2);';
	}

	try {
		const result = await db.query(query, [user, preference]);

		if (result.rowCount > 0) {
			return 'PREFERENCES_SET';
		} else {
			return 'DB_ERROR';
		}
	} catch (error) {
		console.error(error);
		return 'DB_ERROR';
	}
}

async function updateNotificationPreference(user, preference) {
	let query = '';
	if (await userPreferencesExist(user)) {
		query = 'UPDATE user_preferences SET enable_notifications=$2 WHERE id=$1;';
	} else {
		query = 'INSERT INTO user_preferences (id, enable_notifications) VALUES ($1, $2);';
	}

	try {
		const result = await db.query(query, [user, preference]);

		if (result.rowCount > 0) {
			return 'PREFERENCES_SET';
		} else {
			return 'DB_ERROR';
		}
	} catch (error) {
		console.error(error);
		return 'DB_ERROR';
	}
}

async function updateLocationPreference(user, preference) {
	let query = '';
	if (await userPreferencesExist(user)) {
		query = 'UPDATE user_preferences SET enable_location=$2 WHERE id=$1;';
	} else {
		query = 'INSERT INTO user_preferences (id, enable_location) VALUES ($1, $2);';
	}

	try {
		const result = await db.query(query, [user, preference]);

		if (result.rowCount > 0) {
			return 'PREFERENCES_SET';
		} else {
			return 'DB_ERROR';
		}
	} catch (error) {
		console.error(error);
		return 'DB_ERROR';
	}
}

async function fetchUserPreferences(user) {
	try {
		const result = await db.query(
			'SELECT theme, enable_notifications, enable_location FROM user_preferences WHERE id=$1',
			[user]
		);

		if (result.rowCount > 0) {
			return result.rows[0];
		} else {
			return 'PREFERENCES_NOT_SET';
		}
	} catch (error) {
		console.error(error);
		return 'DB_ERROR';
	}
}

async function userPreferencesExist(user) {
	const result = await db.query('SELECT * FROM user_preferences WHERE id=$1;', [user]);

	if (result.rowCount > 0) {
		return true;
	} else {
		return false;
	}
}

export const profileRepo = {
	updateThemePreference,
	updateNotificationPreference,
	updateLocationPreference,
	fetchUserPreferences,
};
