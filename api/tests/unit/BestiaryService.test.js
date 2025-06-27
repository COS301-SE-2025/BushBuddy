import { beforeEach, describe, jest } from '@jest/globals';

jest.unstable_mockModule('../../src/repositories/bestiaryRepository.js', () => ({
	__esModule: true,
	bestiaryRepository: {
		getAllAnimals: jest.fn(),
	},
}));

const { bestiaryRepository } = await import('../../src/repositories/bestiaryRepository.js');
const { bestiaryService } = await import('../../src/services/bestiaryService.js');

describe('BestiaryService', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('getAllAnimals should return sorted animals', async () => {
		const mockAnimals = [
			{ id: 2, name: 'African Lion' },
			{ id: 1, name: 'African Elephant' },
			{ id: 3, name: 'Giraffe' },
		];

		bestiaryRepository.getAllAnimals.mockResolvedValue(mockAnimals);

		const result = await bestiaryService.getAllAnimals();

		expect(bestiaryRepository.getAllAnimals).toHaveBeenCalled();
		expect(result).toEqual([
			{ id: 1, name: 'African Elephant' },
			{ id: 2, name: 'African Lion' },
			{ id: 3, name: 'Giraffe' },
		]);
	});

	test('getAllAnimals should handle empty array', async () => {
		bestiaryRepository.getAllAnimals.mockResolvedValue([]);

		const result = await bestiaryService.getAllAnimals();

		expect(bestiaryRepository.getAllAnimals).toHaveBeenCalled();
		expect(result).toEqual([]);
	});

	test('getAllAnimals should throw an error if repository fails', async () => {
		const errorMessage = 'Database error';
		bestiaryRepository.getAllAnimals.mockRejectedValue(new Error(errorMessage));

		await expect(bestiaryService.getAllAnimals()).rejects.toThrow('Failed to retrieve animals from service layer');
		expect(bestiaryRepository.getAllAnimals).toHaveBeenCalled();
	});
});
