import {
	isAuthenticated,
	loginUser,
	registerUser,
	updateUserPreferences,
	fetchUserPreferences,
} from '../services/userService';
import { LoginRequest, RegisterRequest } from '../models/UserModel';

export async function handleLogin(username, password) {
	try {
		const loginRequest = new LoginRequest({ username, password });
		const user = await loginUser(loginRequest);
		return { success: true, user };
	} catch (error) {
		return {
			success: false,
			message: error.response?.data?.message || 'Login Failed',
		};
	}
}

export async function handleRegister(username, email, password) {
	try {
		const registerRequest = new RegisterRequest({ username, email, password });
		const user = await registerUser(registerRequest);

		return { success: true, user };
	} catch (error) {
		return {
			success: false,
			message: error.response?.data?.message || 'Register User Failed',
		};
	}
}

export async function checkAuthStatus() {
	try {
		const authenticated = await isAuthenticated();
		return authenticated;
	} catch (error) {
		return false;
	}
}

export async function updatePreferences(preference) {
	try {
		const result = await updateUserPreferences(preference);
		return result;
	} catch (error) {
		return {
			success: false,
			message: 'Failed to update user preferences',
		};
	}
}

export async function fetchPreferences() {
	try {
		const result = await fetchUserPreferences();
		return result;
	} catch (error) {
		return {
			success: false,
			message: 'Failed to fetch user preferences',
		};
	}
}
