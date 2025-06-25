import bcrypt from 'bcrypt';
import { authRepository } from '../repositories/authRepository.js';

async function registerUser({ username, password, email }) {
	const userData = { username, password, email };
	if (!userData.username || !userData.password || !userData.email) {
		throw new Error('Username, password, and email are required');
	}
	if (authRepository.userExists(userData.username)) {
		throw new Error('Username already exists');
	}
	bcrypt
		.hash(userData.password, 10, (err, hash) => {
			if (err) throw new Error('Error hashing password');
			userData.password = hash;
		})
		.then(() => {
			authRepository
				.createUser(userData)
				.then((user) => {
					return user;
				})
				.catch((error) => {
					throw new Error(`Error creating user: ${error.message}`);
				});
		});
}

async function loginUser({ username, password }) {
	if (!username || !password) {
		throw new Error('Username and password are required');
	}
	authRepository
		.getUserByUsername(username)
		.then((user) => {
			if (!user) {
				throw new Error('User not found');
			}
			bcrypt.compare(password, user.password, (err, result) => {
				if (err) throw new Error('Error comparing passwords');
				if (!result) {
					throw new Error('Invalid password');
				}
				return { id: user.id, username: user.username, email: user.email };
			});
		})
		.catch((error) => {
			throw new Error(`Error logging in user: ${error.message}`);
		});
}

export const authService = {
	registerUser,
	loginUser,
};
