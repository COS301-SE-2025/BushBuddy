import apiClient from './apiClient';
import { User } from '../models/UserModel';

export async function loginUser(loginRequest) {
	const response = await apiClient.post('/auth/login', loginRequest);
	return new User({ username: response.data.data.username });
}

export async function registerUser(registerRequest) {
	const response = await apiClient.post('/auth/register', registerRequest);
	return new User(response.data.username);
}

export async function isAuthenticated() {
	const response = await apiClient.get('/auth/status');
	return response.data.success;
}

export async function updateUserPreferences(preferences) {
	const response = await apiClient.post('/profile/preferences', { preferences: preferences });
	return response.data;
}
