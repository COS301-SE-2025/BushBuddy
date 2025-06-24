import express from 'express';

import authRoute from './routes/authRoute.js';

const app = express();

app.use(express.json());

app.use((req, res, next) => {
	// user authentication through JWT etc. can be done here
	console.log(`Request received: ${req.method} ${req.url}`);
	next();
});

// routes go here
app.use('/api/auth', authRoute);

export default app;
