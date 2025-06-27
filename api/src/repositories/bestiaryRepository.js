import db from '../db/index.js';

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

async function getAllAnimals() {
	try {
		const query = 'SELECT * FROM animals ORDER BY name ASC';
		const result = await db.query(query);
		return result.rows;
	} catch (error) {
		console.error('Database query error in getAllAnimals:', error);

		// Fallback to mock data if database fails (for development)
		console.warn('Falling back to mock data due to database error');

		return mockAnimals;
	}
}

export const bestiaryRepository = {
	getAllAnimals,
};
