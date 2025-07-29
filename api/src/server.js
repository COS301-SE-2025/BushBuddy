import app from './app.js';
import authApp from './AuthenticationServer/authRoute.js';
import discoveryApp from './DiscoveryServer/discoveryRoute.js';

const AUTH_PORT = process.env.AUTH_PORT || 4001;
authApp.listen(AUTH_PORT, () => {
	console.log(`Auth service is running on port ${AUTH_PORT}`);
});

const DISCOVERY_PORT = process.env.DISCOVERY_PORT || 4002;
discoveryApp.listen(DISCOVERY_PORT, () => {
	console.log(`Bestiary service is running on port ${DISCOVERY_PORT}`);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
