import { beforeEach, describe, jest } from '@jest/globals';

const DISCOVERY_URL = '../../src/DiscoveryServer/';

jest.unstable_mockModule(`${DISCOVERY_URL}discoveryRepository.js`, () => ({
	__esModule: true,
	discoveryRepository: {
		getAllAnimals: jest.fn(),
	},
}));

const { discoveryRepository } = await import(`${DISCOVERY_URL}discoveryRepository.js`);
const { discoveryService } = await import(`${DISCOVERY_URL}discoveryService.js`);

describe('discoveryService', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('getAllAnimals should return sorted animals', async () => {
		const mockAnimals = [
			{ id: 2, name: 'African Lion' },
			{ id: 1, name: 'African Elephant' },
			{ id: 3, name: 'Giraffe' },
		];

		discoveryRepository.getAllAnimals.mockResolvedValue(mockAnimals);

		const result = await discoveryService.getAllAnimals();

		expect(discoveryRepository.getAllAnimals).toHaveBeenCalled();
		expect(result).toEqual([
			{ id: 1, name: 'African Elephant' },
			{ id: 2, name: 'African Lion' },
			{ id: 3, name: 'Giraffe' },
		]);
	});

	test('getAllAnimals should handle empty array', async () => {
		discoveryRepository.getAllAnimals.mockResolvedValue([]);

		const result = await discoveryService.getAllAnimals();

		expect(discoveryRepository.getAllAnimals).toHaveBeenCalled();
		expect(result).toEqual([]);
	});

	test('getAllAnimals should throw an error if repository fails', async () => {
		const errorMessage = 'Database error';
		discoveryRepository.getAllAnimals.mockRejectedValue(new Error(errorMessage));

		await expect(discoveryService.getAllAnimals()).rejects.toThrow('Failed to retrieve animals from service layer');
		expect(discoveryRepository.getAllAnimals).toHaveBeenCalled();
	});
});
