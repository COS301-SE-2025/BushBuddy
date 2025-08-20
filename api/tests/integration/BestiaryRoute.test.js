import { describe } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import db from '../../src/db/index.js';
import discoveryApp from '../../src/DiscoveryServer/discoveryRoute.js';
import jwt from 'jsonwebtoken';

const token = jwt.sign({ id: 1, username: 'Test User', admin: false }, process.env.JWT_SECRET);

let gatewayServer;
let bestiaryServer;

beforeAll((done) => {
	const BESTIARY_PORT = process.env.BESTIARY_PORT || 4002;
	const GATEWAY_PORT = process.env.PORT || 3000;

	gatewayServer = app.listen(GATEWAY_PORT, () => {
		console.log(`✅ API Gateway running on port ${GATEWAY_PORT}`);
		done();
	});
});

afterAll(async () => {
	await new Promise((resolve) => gatewayServer.close(resolve));
	// await new Promise((resolve) => bestiaryServer.close(resolve));
	await db.close();
});

describe('Bestiary Integration Tests', () => {
	test('GET /bestiary/all should return sorted animals', async () => {
		const res = await request(app).get('/discover/bestiary').set('Cookie', `token=${token}`);
		// console.log('Response from /bestiary/all:', res.body);
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('success', true);
		expect(res.body).toHaveProperty('message', 'Animals retrieved successfully');
		expect(res.body.data).toBeInstanceOf(Array);
		expect(res.body.data.length).toBeGreaterThan(0);
	});
});
