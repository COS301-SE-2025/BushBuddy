import express from 'express';
import { authController } from './authController.js';
import cookieParser from 'cookie-parser';

const authApp = express.Router();
authApp.use(express.json());

// routes to controllers go here

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Create a new account
 *     tags:
 *       - Accounts
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "Testuser"
 *               email:
 *                 type: string
 *                 example: "example@email.com"
 *               password:
 *                 type: string
 *                 example: "hs7dy7hiq^%(saoi"
 *     responses:
 *       201:
 *         description: Account created successfully
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "token=<jwt_token>; HttpOnly; Secure; SameSite=Strict"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *       400:
 *         description: Account registration failed due to bad data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User registration failed"
 *       500:
 *         description: Account registration failed due to internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Registration failed"
 */
authApp.post('/register', authController.registerUser);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login to existing account
 *     tags:
 *       - Accounts
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "Testuser"
 *               password:
 *                 type: string
 *                 example: "hs7dy7hiq^%(saoi"
 *     responses:
 *       200:
 *         description: Login successful, sets httpOnly cookie with JWT token
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "token=<jwt_token>; HttpOnly; Secure; SameSite=Strict"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *       401:
 *         description: Login failed due to invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid username or password"
 *       500:
 *         description: Login failed due to internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Login failed"
 */
authApp.post('/login', authController.loginUser);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logout from current session
 *     tags:
 *       - Accounts
 *     responses:
 *       200:
 *         description: Logout successful, clears authentication cookie
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "token=; HttpOnly; Secure; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Logout successful"
 *       401:
 *         description: Unauthorized - Not logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Logout failed due to internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Logout failed"
 */
authApp.post('/logout', authController.logoutUser);
authApp.get('/status', authController.checkLoginStatus);

export default authApp;
