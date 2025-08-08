import { beforeEach, describe, expect, jest, test } from '@jest/globals';

jest.unstable_mockModule('../../src/db/index.js', () => ({
	__esModule: true,
	default: {
		query: jest.fn(),
	},
}));

jest.unstable_mockModule('../../src/db/imageStorage.js', () => ({
	__esModule: true,
	default: {
		storeImage: jest.fn(),
		fetchImage: jest.fn(),
	},
}));

const db = (await import('../../src/db/index.js')).default;
const s3 = (await import('../../src/db/imageStorage.js')).default;
const { discoveryRepository } = await import('../../src/DiscoveryServer/discoveryRepository.js');

const mockAnimals = [
	{
		id: 1,
		name: 'African Elephant',
		species: 'Loxodonta africana',
		category: 'Mammal',
		habitat: 'Savanna, Forest',
		conservation_status: 'Endangered',
		description: 'The largest land animal, known for its intelligence and strong social bonds.',
		image_url: '/images/african-elephant.jpg',
		weight_kg: 6000,
		height_cm: 400,
		lifespan_years: 70,
		diet: 'Herbivore',
		// created_at: new Date(),
		// updated_at: new Date(),
	},
	{
		id: 2,
		name: 'African Lion',
		species: 'Panthera leo',
		category: 'Mammal',
		habitat: 'Savanna, Grassland',
		conservation_status: 'Vulnerable',
		description: "Known as the 'King of the Jungle', lions are social cats that live in prides.",
		image_url: '/images/african-lion.jpg',
		weight_kg: 190,
		height_cm: 120,
		lifespan_years: 15,
		diet: 'Carnivore',
		// created_at: new Date(),
		// updated_at: new Date(),
	},
	{
		id: 3,
		name: 'Giraffe',
		species: 'Giraffa camelopardalis',
		category: 'Mammal',
		habitat: 'Savanna, Woodland',
		conservation_status: 'Vulnerable',
		description: 'The tallest living terrestrial animal, known for its extremely long neck and legs.',
		image_url: '/images/giraffe.jpg',
		weight_kg: 1750,
		height_cm: 600,
		lifespan_years: 25,
		diet: 'Herbivore',
		// created_at: new Date(),
		// updated_at: new Date(),
	},
	{
		id: 4,
		name: 'Cheetah',
		species: 'Acinonyx jubatus',
		category: 'Mammal',
		habitat: 'Savanna, Grassland',
		conservation_status: 'Vulnerable',
		description: 'The fastest land animal, capable of reaching speeds up to 70 mph.',
		image_url: '/images/cheetah.jpg',
		weight_kg: 72,
		height_cm: 90,
		lifespan_years: 12,
		diet: 'Carnivore',
		// created_at: new Date(),
		// updated_at: new Date(),
	},
	{
		id: 5,
		name: 'Black Rhinoceros',
		species: 'Diceros bicornis',
		category: 'Mammal',
		habitat: 'Savanna, Desert',
		conservation_status: 'Critically Endangered',
		description: 'A large herbivore with two horns, critically endangered due to poaching.',
		image_url: '/images/black-rhino.jpg',
		weight_kg: 1400,
		height_cm: 180,
		lifespan_years: 45,
		diet: 'Herbivore',
		// created_at: new Date(),
		// updated_at: new Date(),
	},
	{
		id: 6,
		name: 'African Wild Dog',
		species: 'Lycaon pictus',
		category: 'Mammal',
		habitat: 'Savanna, Grassland',
		conservation_status: 'Endangered',
		description: 'Highly social pack hunters with distinctive mottled coat patterns.',
		image_url: '/images/african-wild-dog.jpg',
		weight_kg: 25,
		height_cm: 75,
		lifespan_years: 11,
		diet: 'Carnivore',
		// created_at: new Date(),
		// updated_at: new Date(),
	},
	{
		id: 1,
		name: 'African Elephant',
		species: 'Loxodonta africana',
		category: 'Mammal',
		habitat: 'Savanna, Forest',
		conservation_status: 'Endangered',
		description: 'The largest land animal, known for its intelligence and strong social bonds.',
		image_url: '/images/african-elephant.jpg',
		weight_kg: 6000,
		height_cm: 400,
		lifespan_years: 70,
		diet: 'Herbivore',
		// created_at: new Date(),
		// updated_at: new Date(),
	},
	{
		id: 2,
		name: 'African Lion',
		species: 'Panthera leo',
		category: 'Mammal',
		habitat: 'Savanna, Grassland',
		conservation_status: 'Vulnerable',
		description: "Known as the 'King of the Jungle', lions are social cats that live in prides.",
		image_url: '/images/african-lion.jpg',
		weight_kg: 190,
		height_cm: 120,
		lifespan_years: 15,
		diet: 'Carnivore',
		// created_at: new Date(),
		// updated_at: new Date(),
	},
];

describe('Testing discoveryRepository', () => {
	beforeEach(() => {
		db.query.mockClear();
	});

	describe('Testing bestiary functions', () => {
		test('getAllAnimals should return all animals from the database', async () => {
			db.query.mockResolvedValueOnce({ rows: mockAnimals });

			const result = await discoveryRepository.getAllAnimals();

			expect(db.query).toHaveBeenCalledWith('SELECT * FROM animals ORDER BY name ASC');
			expect(result).toEqual(mockAnimals);
		});

		test('getAllAnimals should return an empty array if no animals exist', async () => {
			db.query.mockResolvedValueOnce({ rows: [] });

			const result = await discoveryRepository.getAllAnimals();

			expect(db.query).toHaveBeenCalledWith('SELECT * FROM animals ORDER BY name ASC');
			expect(result).toEqual([]);
		});

		test('getAllAnimals should return mock data if database query fails', async () => {
			db.query.mockRejectedValueOnce(new Error('Database query failed'));

			const result = await discoveryRepository.getAllAnimals();

			expect(db.query).toHaveBeenCalledWith('SELECT * FROM animals ORDER BY name ASC');
			expect(result).toEqual(mockAnimals);
		});

		test('addNewBestiaryEntry should return image key for new animal', async () => {
			s3.storeImage.mockResolvedValueOnce('testkey');
			db.query.mockResolvedValueOnce({ rowCount: 0 }).mockResolvedValueOnce({ rows: ['testkey'] });

			const result = await discoveryRepository.addNewBestiaryEntry(
				{ name: 'test', type: 'test', description: 'test' },
				'test-img'
			);

			// console.dir(db.query.mock.calls, { depth: null });
			expect(db.query.mock.calls[0][0]).toMatch(/SELECT/i);
			expect(db.query.mock.calls[1][0]).toMatch(/INSERT/i);
			expect(result).toEqual('testkey');
		});

		test('addNewBestiaryEntry should return image key for existing animal', async () => {
			s3.storeImage.mockResolvedValueOnce('testkey');
			db.query.mockResolvedValueOnce({ rowCount: 1 }).mockResolvedValueOnce({ rows: ['testkey'] });

			const result = await discoveryRepository.addNewBestiaryEntry(
				{ name: 'test', type: 'test', description: 'test' },
				'test-img'
			);

			// console.dir(db.query.mock.calls, { depth: null });
			expect(db.query.mock.calls[0][0]).toMatch(/SELECT/i);
			expect(db.query.mock.calls[1][0]).toMatch(/UPDATE/i);
			expect(result).toEqual('testkey');
		});

		test('addNewBestiaryEntry should return an error if something goes wrong uploading the image', async () => {
			s3.storeImage.mockRejectedValueOnce(new Error('R2 Storage Error'));
			db.query.mockRejectedValueOnce(new Error('Database Error'));

			await expect(discoveryRepository.addNewBestiaryEntry('mock details', 'mock image')).rejects.toThrow(
				'Error adding new animal: R2 Storage Error'
			);
		});
	});
});
