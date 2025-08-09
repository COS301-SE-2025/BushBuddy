import { beforeEach, describe, jest, test } from '@jest/globals';

const DISCOVERY_URL = '../../src/DiscoveryServer/';

jest.unstable_mockModule(`${DISCOVERY_URL}discoveryService.js`, () => ({
	__esModule: true,
	discoveryService: {
		getAllAnimals: jest.fn(),
	},
}));

const { discoveryService } = await import(`${DISCOVERY_URL}discoveryService.js`);
const { discoveryController } = await import(`${DISCOVERY_URL}discoveryController.js`);

describe('discoveryController', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

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
			count: 3,
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
			count: 0,
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
});
