import { authService } from '../services/authService.js';

async function registerUser(req, res) {
	try {
		const { username, password, email } = req.body;
		const user = await authService.registerUser({ username, password, email });
		if (!user) {
			return res.status(400).json({ error: 'User registration failed' });
		}
		res.status(201).json(user);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
}

async function loginUser(req, res) {
	try {
		const { username, password } = req.body;
		const user = await authService.loginUser({ username, password });
		if (!user) {
			return res.status(401).json({ error: 'Invalid username or password' });
		}
		res.status(200).json(user);
	} catch (error) {
		res.status(401).json({ error: error.message });
	}
}

async function logoutUser(req, res) {
	try {
		const { userId } = req.body;
		await authService.logoutUser(userId);
		res.status(200).json({ message: 'User logged out successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

export const authController = {
	registerUser,
	loginUser,
	logoutUser,
};
