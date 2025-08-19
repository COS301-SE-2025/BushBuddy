import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Authentication Service API',
			version: '1.0.0',
			description: 'Handles authentication and authorization.',
		},
		servers: [
			{
				url: 'http://localhost:4001', // This service’s port
			},
		],
	},
	apis: ['./src/AuthenticationServer/*.js'], // Scan only this service’s files
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwaggerAuth(app) {
	app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
	app.get('/docs-json', (req, res) => res.json(swaggerSpec));
}
