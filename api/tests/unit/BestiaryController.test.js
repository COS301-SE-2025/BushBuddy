import { beforeEach, describe, jest, test } from '@jest/globals';

jest.unstable_mockModule('../../src/services/bestiaryService.js', () => ({
	__esModule: true,
	bestiaryService: {
		getAllAnimals: jest.fn(),
	},
}));

const { bestiaryService } = await import('../../src/services/bestiaryService.js');
const { bestiaryController } = await import('../../src/controllers/bestiaryController.js');

describe('BestiaryController', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('getAllAnimals should return sorted animals', async () => {
		const mockAnimals = [
			{ id: 2, name: 'African Lion' },
			{ id: 1, name: 'African Elephant' },
			{ id: 3, name: 'Giraffe' },
		];

		bestiaryService.getAllAnimals.mockResolvedValue(mockAnimals.sort((a, b) => a.name.localeCompare(b.name)));

		const req = {};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		await bestiaryController.getAllAnimals(req, res);

		// console.log(res.json.mock.calls[0][0]);

		expect(bestiaryService.getAllAnimals).toHaveBeenCalled();
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
		bestiaryService.getAllAnimals.mockResolvedValue([]);

		const req = {};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		await bestiaryController.getAllAnimals(req, res);

		expect(bestiaryService.getAllAnimals).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			success: true,
			message: 'Animals retrieved successfully',
			data: [],
			count: 0,
		});
	});

	test('getAllAnimals should handle errors', async () => {
		bestiaryService.getAllAnimals.mockRejectedValue(new Error('Database error'));

		const req = {};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		await bestiaryController.getAllAnimals(req, res);

		expect(bestiaryService.getAllAnimals).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			message: 'Internal server error while retrieving animals',
			error: undefined,
		});
	});
});
