import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Discovery Service API',
			version: '1.0.0',
			description: 'Handles endpoints for discovery service',
		},
		servers: [
			{
				url: 'http://localhost:4002', // This service’s port
			},
		],
	},
	apis: ['./src/DiscoveryServer/*.js'], // Scan only this service’s files
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwaggerDiscovery(app) {
	app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
	app.get('/docs-json', (req, res) => res.json(swaggerSpec));
}
