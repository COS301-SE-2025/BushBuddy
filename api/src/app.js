import express from 'express';
import proxy from 'express-http-proxy';

const app = express();

const AUTH_PORT = process.env.AUTH_PORT || 4001;
const DISCOVER_PORT = process.env.DISCOVER_PORT || 4002;
const SIGHTINGS_PORT = process.env.SIGHTINGS_PORT || 4003;
const POST_PORT = process.env.POST_PORT || 4003;

const publicRoutes = ['/auth/register', '/auth/login'];

app.use((req, res, next) => {
	console.log(`Request received: ${req.method} ${req.url}`);
	// Check if the request is for a public route
	if (publicRoutes.includes(req.path)) {
		return next(); // Skip authentication for public routes
	}

	// user authentication through JWT etc. can be done here

	next();
});

// routes go here
app.use(
	'/auth',
	proxy(`http://localhost:${AUTH_PORT}`, {
		proxyReqPathResolver: (req) => {
			return req.originalUrl.replace('/auth', '');
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

export default app;
