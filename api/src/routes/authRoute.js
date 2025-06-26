import express from 'express';
import { authController } from '../controllers/authController.js';

const authApp = express();

// routes to controllers go here
authApp.post('/register', authController.registerUser);
authApp.post('/login', authController.loginUser);
authApp.post('/logout', authController.logoutUser);

const PORT = process.env.AUTH_SERVICE_PORT || 4001;

authApp.listen(PORT, () => {
	console.log(`Auth service is running on port ${PORT}`);
});
