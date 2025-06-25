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
			return authRepository.createUser(userData);
		});
}

async function loginUser({ username, password }) {
	if (!username || !password) {
		throw new Error('Username and password are required');
	}
	const user = await authRepository.getUserByUsername(username);
	if (!user) {
		throw new Error('User not found');
	}
	bcrypt
		.compare(password, user.password, (err, result) => {
			if (err) throw new Error('Error comparing passwords');
			if (!result) {
				throw new Error('Invalid password');
			}
		})
		.then(() => {
			return user;
		});
}

export const authService = {
	registerUser,
	loginUser,
};
