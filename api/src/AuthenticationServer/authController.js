import { authService } from './authService.js';
import jwt from 'jsonwebtoken';

async function registerUser(req, res) {
	try {
		const { username, password, email } = req.body;
		const token = await authService.registerUser({ username, password, email });
		if (!token) {
			return res.status(400).json({ success: false, message: 'User registration failed' });
		}
		res.cookie('token', token, {
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 24 * 60 * 60 * 1000, // 24 hours
		});
		res.status(201).json({ success: true, message: 'User registered successfully', data: { username } });
	} catch (error) {
		// console.error('Error in registerUser:', error);
		res.status(500).json({ success: false, message: 'Registration failed' });
	}
}

async function loginUser(req, res) {
	try {
		const { username, password } = req.body;
		const token = await authService.loginUser({ username, password });
		if (!token) {
			return res.status(401).json({ success: false, message: 'Invalid username or password' });
		}
		res.cookie('token', token, {
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 24 * 60 * 60 * 1000, // 24 hours
		});
		res.status(200).json({ success: true, message: 'User logged in successfully', data: { username } });
	} catch (error) {
		console.error('Error in loginUser:', error);
		res.status(500).json({ success: false, message: 'Login failed' });
	}
}

async function logoutUser(req, res) {
	try {
		const { userId } = req.body;
		// await authService.logoutUser(userId);
		res.clearCookie('token');
		res.status(200).json({ success: true, message: 'User logged out successfully' });
	} catch (error) {
		res.status(500).json({ success: false, message: 'Logout failed' });
	}
}

async function checkLoginStatus(req, res) {
	try {
		// const userHeader = req.headers['x-user-data'];
		// const user = userHeader ? JSON.parse(userHeader) : null;
		const token = req.cookies.token;
		if (!token)
			return res.status(401).json({ success: false, message: 'You must be logged in to perform this action' });

		try {
			const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
			req.user = decodedUser;
		} catch (error) {
			return res.status(401).json({ success: false, message: 'You must be logged in to perform this action' });
		}

		const user = req.user;
		if (!user) {
			return res.status(401).json({ success: false, message: 'User not logged in' });
		}

		return res.status(200).json({ success: true, message: 'User authenticated', data: user.username });
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
}

export const authController = {
	registerUser,
	loginUser,
	logoutUser,
	checkLoginStatus,
};
