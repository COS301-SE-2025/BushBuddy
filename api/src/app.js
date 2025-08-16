import express from 'express';
import proxy from 'express-http-proxy';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const app = express();

dotenv.config();

const allowedOrigins = process.env.ALLOWED_ORIGINS;

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);

			if (/^http:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) {
				return callback(null, true);
			}

			if (allowedOrigins.includes(origin)) {
				return callback(null, true);
			}

			return callback(new Error('Not allowed by CORS'));
		},
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	})
);

app.options('*', cors());

app.use(express.json());
app.use(cookieParser());

const AUTH_PORT = process.env.AUTH_PORT || 4001;
const DISCOVER_PORT = process.env.DISCOVER_PORT || 4002;
const SIGHTINGS_PORT = process.env.SIGHTINGS_PORT || 4003;
const POST_PORT = process.env.POST_PORT || 4003;

const publicRoutes = ['/auth/register/', '/auth/login/', '/auth/status/'];

app.use((req, res, next) => {
	console.log(`Request received: ${req.method} ${req.url}`);
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
app.use(
	'/auth',
	proxy(`http://localhost:${AUTH_PORT}`, {
		proxyReqPathResolver: (req) => {
			return req.originalUrl.replace('/auth', '');
		},
		proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            if (srcReq.user) {
                proxyReqOpts.headers['x-user-data'] = JSON.stringify(srcReq.user);
            }
            return proxyReqOpts;
        },
	})
);

app.use(
	'/discover',
	proxy(`http://localhost:${DISCOVER_PORT}`, {
		limit: '20mb',
		proxyReqPathResolver: (req) => {
			return req.originalUrl.replace('/discover', '');
		},
	})
);

app.use(
	'/sightings',
	proxy(`http://localhost:${SIGHTINGS_PORT}`, {
		proxyReqPathResolver: (req) => {
			return req.originalUrl.replace('/sightings', '');
		},
	})
);

app.use(
	'/posts',
	proxy(`http://localhost:${POST_PORT}`, {
		proxyReqPathResolver: (req) => {
			return req.originalUrl.replace('/posts', '');
		},
	})
);

// default route for handling 404 errors
app.use((req, res) => {
	res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
	console.error('Global error handler:', err);
	res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
