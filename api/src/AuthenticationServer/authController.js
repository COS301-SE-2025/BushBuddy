import { authService } from './authService.js';

async function registerUser(req, res) {
	try {
		const { username, password, email } = req.body;
		const token = await authService.registerUser({ username, password, email });
		if (!token) {
			return res.status(400).json({ error: 'User registration failed' });
		}
		res.cookie('token', token, {
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 24 * 60 * 60 * 1000, // 24 hours
		});
		res.status(201).json({ message: 'User registered successfully' });
	} catch (error) {
		// console.error('Error in registerUser:', error);
		res.status(400).json({ error: error.message });
	}
}

async function loginUser(req, res) {
	try {
		const { username, password } = req.body;
		const token = await authService.loginUser({ username, password });
		if (!token) {
			return res.status(401).json({ error: 'Invalid username or password' });
		}
		res.cookie('token', token, {
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 24 * 60 * 60 * 1000, // 24 hours
		});
		res.status(200).json({ message: 'User logged in successfully' });
	} catch (error) {
		// console.error('Error in loginUser:', error);
		res.status(401).json({ error: error.message });
	}
}

async function logoutUser(req, res) {
	try {
		const { userId } = req.body;
		// await authService.logoutUser(userId);
		res.clearCookie('token');
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
