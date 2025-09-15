import { nanoid } from 'nanoid';
import db from '../db/index.js';

async function createUser(userData) {
	const { username, password, email } = userData;
	const userId = nanoid(8);

	return db
		.query(
			'INSERT INTO users (id, username, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING (id, username, email, is_admin)',
			[userId, username, email, password]
		)
		.then(() => {
			return { id: userId, username, email };
		})
		.catch((error) => {
			throw new Error(`Error creating user: ${error.message}`);
		});
}

async function getUserById(userId) {
	return db
		.query('SELECT username, email FROM users WHERE id = $1', [userId])
		.then((result) => {
			return result.rows[0] || null;
		})
		.catch((error) => {
			throw new Error(`Error fetching user: ${error.message}`);
		});
}

async function getUserByUsername(username) {
	return db
		.query('SELECT id, email, password_hash, is_admin FROM users WHERE username = $1', [username])
		.then((result) => {
			return result.rows[0] || null;
		})
		.catch((error) => {
			throw new Error(`Error fetching user: ${error.message}`);
		});
}

async function updateUserPreferences(userId, updatedData) {
	const { isPrivate, useGeolocation } = updatedData;

	return db
		.query('UPDATE users SET is_private = $1, use_geolocation = $2 WHERE id = $3 RETURNING (id, username, email)', [
			isPrivate,
			useGeolocation,
			userId,
		])
		.then((result) => {
			return result.rows[0] || null;
		})
		.catch((error) => {
			throw new Error(`Error updating user preferences: ${error.message}`);
		});
}

async function deleteUser(userId) {
	return db
		.query('DELETE FROM users WHERE id = $1', [userId])
		.then(() => {
			return { message: 'User deleted successfully' };
		})
		.catch((error) => {
			throw new Error(`Error deleting user: ${error.message}`);
		});
}

async function getAllUsers() {
	return db
		.query('SELECT id, username, email FROM users')
		.then((result) => {
			return result.rows;
		})
		.catch((error) => {
			throw new Error(`Error fetching all users: ${error.message}`);
		});
}

async function userExists(username) {
	return db
		.query('SELECT COUNT(*) FROM users WHERE username = $1', [username])
		.then((result) => {
			return result.rows[0].count > 0;
		})
		.catch((error) => {
			throw new Error(`Error checking if user exists: ${error.message}`);
		});
}

export const authRepository = {
	createUser,
	getUserById,
	getUserByUsername,
	updateUserPreferences,
	deleteUser,
	getAllUsers,
	userExists,
};
