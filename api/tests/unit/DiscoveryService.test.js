import { beforeEach, describe, expect, jest } from '@jest/globals';

const DISCOVERY_URL = '../../src/DiscoveryServer/';

jest.unstable_mockModule(`${DISCOVERY_URL}discoveryRepository.js`, () => ({
	__esModule: true,
	discoveryRepository: {
		getAllAnimals: jest.fn(),
		addNewBestiaryEntry: jest.fn(),
		fetchAnimalImage: jest.fn(),
	},
}));

const { discoveryRepository } = await import(`${DISCOVERY_URL}discoveryRepository.js`);
const { discoveryService } = await import(`${DISCOVERY_URL}discoveryService.js`);

describe('discoveryService', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Bestiary functions', () => {
		test('getAllAnimals should return sorted animals', async () => {
			const mockAnimals = [
				{ id: 2, name: 'African Lion' },
				{ id: 1, name: 'African Elephant' },
				{ id: 3, name: 'Giraffe' },
			];

			discoveryRepository.getAllAnimals.mockResolvedValue(mockAnimals);
			discoveryRepository.fetchAnimalImage.mockResolvedValue('mock-image');

			const result = await discoveryService.getAllAnimals();

			expect(discoveryRepository.getAllAnimals).toHaveBeenCalled();
			expect(result).toEqual([
				{ id: 1, name: 'African Elephant', image_url: 'mock-image' },
				{ id: 2, name: 'African Lion', image_url: 'mock-image' },
				{ id: 3, name: 'Giraffe', image_url: 'mock-image' },
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

		test('addNewAnimal should return the image key on success', async () => {
			discoveryRepository.addNewBestiaryEntry.mockResolvedValue('mock-key');

			const result = await discoveryService.addNewAnimal('mock-details', 'mock-image');

			expect(result).toEqual('mock-key');
		});

		test('addNewAnimal should throw an error if upload fails', async () => {
			discoveryRepository.addNewBestiaryEntry.mockRejectedValue(new Error('Mock Error'));

			await expect(discoveryService.addNewAnimal('mock-details', 'mock-image')).rejects.toThrow(
				'Failed to add new animal to bestiary'
			);
			expect(discoveryRepository.addNewBestiaryEntry).toHaveBeenCalled();
		});
	});
});
