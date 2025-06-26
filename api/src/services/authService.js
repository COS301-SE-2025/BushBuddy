import * as bcrypt from 'bcrypt';
import { authRepository } from '../repositories/authRepository.js';

async function registerUser({ username, password, email }) {
	const userData = { username, password, email };
	if (!userData.username || !userData.password || !userData.email) {
		throw new Error('Username, password, and email are required');
	}
	if (await authRepository.userExists(userData.username)) {
		throw new Error('Username already exists');
	}
	try {
		const hashedPassword = await bcrypt.hash(userData.password, 10);
		const user = await authRepository.createUser({
			...userData,
			password: hashedPassword,
		});
		return user;
	} catch (error) {
		throw new Error(`Error registering user: ${error.message}`);
	}
}

async function loginUser({ username, password }) {
	if (!username || !password) {
		throw new Error('Username and password are required');
	}

	try {
		const user = await authRepository.getUserByUsername(username);
		if (!user) {
			throw new Error('Invalid username or password');
		}
		console.log('user', user);
		const isPasswordValid = await bcrypt.compare(password, user.password_hash);
		console.log('isPasswordValid', isPasswordValid);
		if (!isPasswordValid) {
			throw new Error('Invalid username or password');
		}
		return { id: user.id, username: username, email: user.email };
	} catch (error) {
		throw new Error(`Error logging in user: ${error.message}`);
	}
}

async function logoutUser(userId) {
	if (!userId) {
		throw new Error('User ID is required');
	}
	try {
		// clear token here
		// temporary logic
		const user = await authRepository.getUserById(userId);
		if (!user) {
			throw new Error('User not found');
		}
		return { message: 'User logged out successfully' };
	} catch (error) {
		throw new Error(`Error logging out user: ${error.message}`);
	}
}

export const authService = {
	registerUser,
	loginUser,
	logoutUser,
};
