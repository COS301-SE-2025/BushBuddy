import express from 'express';
import proxy from 'express-http-proxy';
import swaggerCombine from 'swagger-combine';
import swaggerUI from 'swagger-ui-express';

const app = express();

const AUTH_PORT = process.env.AUTH_PORT || 4001;
const DISCOVER_PORT = process.env.DISCOVER_PORT || 4002;
const SIGHTINGS_PORT = process.env.SIGHTINGS_PORT || 4003;
const POST_PORT = process.env.POST_PORT || 4003;

const publicRoutes = ['/auth/register', '/auth/login', '/docs'];

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
		limit: '20mb',
		proxyReqPathResolver: (req) => {
			return req.originalUrl.replace('/sightings', '');
		},
	})
);

app.use(
	'/posts',
	proxy(`http://localhost:${POST_PORT}`, {
		limit: '20mb',
		proxyReqPathResolver: (req) => {
			return req.originalUrl.replace('/posts', '');
		},
	})
);

app.use('/docs', swaggerUI.serve);

app.get('/docs', async (req, res, next) => {
	try {
		const combinedDoc = await swaggerCombine('./src/swagger-combine.json');
		swaggerUI.setup(combinedDoc)(req, res, next);
	} catch (error) {
		next(error);
	}
});

// default route for handling 404 errors
app.use((req, res) => {
	res.status(404).json({ error: 'Not Found' });
});

export default app;
