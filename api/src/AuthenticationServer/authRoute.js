import express from 'express';
import { authController } from './authController.js';
import cookieParser from 'cookie-parser';

const authApp = express();
authApp.use(express.json());
authApp.use(cookieParser());

// routes to controllers go here
authApp.post('/register', authController.registerUser);
authApp.post('/login', authController.loginUser);
authApp.post('/logout', authController.logoutUser);
authApp.get('/status', authController.checkLoginStatus);

export default authApp;
