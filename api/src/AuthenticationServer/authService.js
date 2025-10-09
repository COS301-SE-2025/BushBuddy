import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authRepository } from './authRepository.js';

async function registerUser({ username, password, email }) {
	const userData = { username, password, email };
	if (!userData.username || !userData.password || !userData.email) {
		return 'MISSING_FIELDS';
	}
	if (await authRepository.userExists(userData.username)) {
		return 'DUPLICATE_ENTRY';
	}
	try {
		const hashedPassword = await bcrypt.hash(userData.password, 10);
		const user = await authRepository.createUser({
			...userData,
			password: hashedPassword,
		});

		const token = jwt.sign(
			{ id: user.id, username: user.username, email: user.email, admin: user.is_admin },
			process.env.JWT_SECRET,
			{
				expiresIn: '24h',
			}
		);

		return token;
	} catch (error) {
		console.error(error.message);
		if (error.message === 'Error creating user: duplicate key value violates unique constraint "users_email_key"')
			return 'DUPLICATE_EMAIL';
		return 'SERVER_ERROR';
	}
}

async function loginUser({ username, password }) {
	if (!username || !password) {
		return 'MISSING_FIELDS';
	}

	try {
		const user = await authRepository.getUserByUsername(username);
		if (!user) {
			return 'INVALID_CRED';
		}
		const isPasswordValid = await bcrypt.compare(password, user.password_hash);
		if (!isPasswordValid) {
			return 'INVALID_CRED';
		}

		const token = jwt.sign(
			{ id: user.id, username: username, email: user.email, admin: user.is_admin },
			process.env.JWT_SECRET,
			{
				expiresIn: '24h',
			}
		);
		return token;
	} catch (error) {
		console.error(error.message);
		return 'SERVER_ERROR';
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

async function changePassword(userID, oldPassword, newPassword) {
	if (!oldPassword || !newPassword) return 'REQ_FIELDS_MISSING';

	try {
		const user = await authRepository.getUserById(userID);
		if (!user) return 'INVALID_REQUEST';

		const validPassword = await bcrypt.compare(oldPassword, user.password_hash);
		if (!validPassword) return 'INCORRECT_PASSWORD';

		const hashedPassword = await bcrypt.hash(newPassword, 10);
		const result = await authRepository.updatePassword(userID, hashedPassword);

		if (result === true) return 'REQUEST_SUCCESS';

		return result;
	} catch (error) {
		console(error);
		return 'SERVER_ERROR';
	}
}

export const authService = {
	registerUser,
	loginUser,
	logoutUser,
	changePassword,
};
