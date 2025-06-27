import app from './app.js';
import authApp from './routes/authRoute.js';
import bestiaryApp from './routes/bestiaryRoute.js';

const AUTH_PORT = process.env.AUTH_PORT || 4001;
authApp.listen(AUTH_PORT, () => {
	console.log(`Auth service is running on port ${AUTH_PORT}`);
});

const BESTIARY_PORT = process.env.BESTIARY_PORT || 4002;
bestiaryApp.listen(BESTIARY_PORT, () => {
	console.log(`Bestiary service is running on port ${BESTIARY_PORT}`);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
