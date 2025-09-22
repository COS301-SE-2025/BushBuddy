import express from 'express';
import proxy from 'express-http-proxy';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import authApp from './AuthenticationServer/authRoute.js';
import discoveryApp from './DiscoveryServer/discoveryRoute.js';
import sightingsApp from './SightingServer/sightingRoute.js';
import postingApp from './PostingServer/postingRoute.js';
import profileApp from './ProfileServer/profileRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

dotenv.config();

const allowedOrigins = process.env.ALLOWED_ORIGINS;

app.use(express.static(path.join(__dirname, '../../frontend/build/')));

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);

			if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
				return callback(null, true);
			}

			if (allowedOrigins.includes(origin)) {
				return callback(null, true);
			}

			return callback(new Error('Not allowed by CORS'));
		},
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
		credentials: true,
		exposedHeaders: ['Set-Cookie'],
	})
);

app.options('*', cors());

app.use(express.json());
app.use(cookieParser());

const AUTH_PORT = process.env.AUTH_PORT || 4001;
const DISCOVER_PORT = process.env.DISCOVER_PORT || 4002;
const SIGHTINGS_PORT = process.env.SIGHTINGS_PORT || 4003;
const POST_PORT = process.env.POST_PORT || 4004;

const publicRoutes = ['/auth/register', '/auth/login', '/login', '/register'];

app.use((req, res, next) => {
	console.log(`Request received: ${req.method} ${req.url}`);
	console.log('Cookies:', req.cookies);
	// console.log('Testing CI/CD');
	// Check if the request is for a public route
	if (publicRoutes.includes(req.path)) {
		return next(); // Skip authentication for public routes
	}

	// res.header('Access-Control-Allow-Origin', '*');

	// user authentication through JWT etc. can be done here
	const token = req.cookies.token;
	if (!token) return res.status(401).json({ success: false, message: 'You must be logged in to perform this action' });

	try {
		const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decodedUser;
	} catch (error) {
		return res.status(401).json({ success: false, message: 'You must be logged in to perform this action' });
	}

	next();
});

// routes go here
app.use('/auth', authApp);

app.use('/discover', discoveryApp);

app.use('/sightings', sightingsApp);

app.use('/posts', postingApp);

app.use('/profile', profileApp);

// app.use('/docs', swaggerUI.serve);

// app.get('/docs', async (req, res, next) => {
// 	try {
// 		const combinedDoc = await swaggerCombine('./src/swagger-combine.json');
// 		swaggerUI.setup(combinedDoc)(req, res, next);
// 	} catch (error) {
// 		next(error);
// 	}
// });

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../../frontend/build/index.html'));
});

// default route for handling 404 errors
app.use((req, res) => {
	res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
	console.error('Global error handler:', err);
	res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
