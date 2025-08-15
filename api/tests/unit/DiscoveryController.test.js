import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { json } from 'express';

const DISCOVERY_URL = '../../src/DiscoveryServer/';

jest.unstable_mockModule(`${DISCOVERY_URL}discoveryService.js`, () => ({
	__esModule: true,
	discoveryService: {
		getAllAnimals: jest.fn(),
		addNewAnimal: jest.fn(),
	},
}));

const { discoveryService } = await import(`${DISCOVERY_URL}discoveryService.js`);
const { discoveryController } = await import(`${DISCOVERY_URL}discoveryController.js`);

describe('discoveryController', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Bestiary endpoints', () => {
		test('getAllAnimals should return sorted animals', async () => {
			const mockAnimals = [
				{ id: 2, name: 'African Lion' },
				{ id: 1, name: 'African Elephant' },
				{ id: 3, name: 'Giraffe' },
			];

			discoveryService.getAllAnimals.mockResolvedValue(mockAnimals.sort((a, b) => a.name.localeCompare(b.name)));

			const req = {};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

			await discoveryController.getAllAnimals(req, res);

			// console.log(res.json.mock.calls[0][0]);

			expect(discoveryService.getAllAnimals).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				message: 'Animals retrieved successfully',
				data: [
					{ id: 1, name: 'African Elephant' },
					{ id: 2, name: 'African Lion' },
					{ id: 3, name: 'Giraffe' },
				],
			});
		});

		test('getAllAnimals should handle empty array', async () => {
			discoveryService.getAllAnimals.mockResolvedValue([]);

			const req = {};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

			await discoveryController.getAllAnimals(req, res);

			expect(discoveryService.getAllAnimals).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				message: 'Animals retrieved successfully',
				data: [],
			});
		});

		test('getAllAnimals should handle errors', async () => {
			discoveryService.getAllAnimals.mockRejectedValue(new Error('Database error'));

			const req = {};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

			await discoveryController.getAllAnimals(req, res);

			expect(discoveryService.getAllAnimals).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				message: 'Internal server error while retrieving animals',
				error: undefined,
			});
		});

		test('insertNewAnimal should add new animal to bestiary', async () => {
			discoveryService.addNewAnimal.mockResolvedValue('mock-key');

			const req = {
				body: {
					name: 'mock-name',
					type: 'mock-type',
					description: 'mock-description',
				},
				file: {
					buffer: 'mock-image',
				},
			};

			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

			await discoveryController.insertNewAnimal(req, res);

			expect(discoveryService.addNewAnimal).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				message: 'mock-name added to bestiary',
			});
		});

		test('insertNewAnimal should handle user caused errors', async () => {
			discoveryService.addNewAnimal.mockResolvedValue(null);
			const req = {
				body: {
					name: 'mock-name',
					type: 'mock-type',
					description: 'mock-description',
				},
				file: {
					buffer: 'mock-image',
				},
			};

			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

			await discoveryController.insertNewAnimal(req, res);

			expect(discoveryService.addNewAnimal).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				message: 'Unable to add animal to bestiary',
			});
		});

		test('insertNewAnimal should handle internal server errors', async () => {
			discoveryService.addNewAnimal.mockRejectedValue(new Error('mock-error'));
			const req = {
				body: {
					name: 'mock-name',
					type: 'mock-type',
					description: 'mock-description',
				},
				file: {
					buffer: 'mock-image',
				},
			};

			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

			await discoveryController.insertNewAnimal(req, res);

			expect(discoveryService.addNewAnimal).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				message: 'Failed to add animal to bestiary',
			});
		});
	});
});
