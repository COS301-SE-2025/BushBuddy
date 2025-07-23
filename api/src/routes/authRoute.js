import express from 'express';
import { authController } from '../controllers/authController.js';

const authApp = express();
authApp.use(express.json());

// routes to controllers go here
authApp.post('/register', authController.registerUser);
authApp.post('/login', authController.loginUser);
authApp.post('/logout', authController.logoutUser);

export default authApp;
