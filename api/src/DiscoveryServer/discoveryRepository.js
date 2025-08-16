import db from '../db/index.js';
import { nanoid } from 'nanoid';
import s3 from '../db/imageStorage.js';

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

async function fetchAnimalImage(key) {
	try {
		const url = await s3.fetchImage(key);
		return url;
	} catch (error) {
		console.error(error);
		throw new Error('Error fetching animal image');
	}
}

/* 
Used to add new animals to the database for the bestiary
Uploads animal image to cloudflare first and then inserts animal
details with image key into the database.
If the animal already exists in the database then only the image key is updated
*/
async function addNewBestiaryEntry(details, image) {
	try {
		const key = nanoid(12);
		const url = await s3.storeImage(key, image);

		const { name, type, description } = details;

		const existing = await db.query('SELECT (id) FROM animals WHERE name=$1;', [name]);

		let result;
		if (existing.rowCount === 0) {
			const query =
				'INSERT INTO animals (name, type, description, image_url) VALUES ($1, $2, $3, $4) RETURNING (image_url);';
			const params = [name, type, description, url];

			result = await db.query(query, params);
		} else {
			const query = 'UPDATE animals SET image_url=$1 WHERE name=$2 RETURNING (image_url);';
			const params = [url, name];

			result = await db.query(query, params);
		}
		return result.rows[0];
	} catch (error) {
		console.error(error);
		throw new Error(`Error adding new animal: ${error.message}`);
	}
}

// fetches all public, non-protected discoveries made by other users as well as every non-protected discovery of current user
// return an array of objects with the following format:
// 	{
// 		image_url: 'image key',
// 		animals: [
// 			{animal_id: 4, animal_name: 'Zebra'},
// 			{animal_id: 7, animal_name: 'Giraffe'}
// 		],
// 		geolocation_long: 'float value for longitude',
// 		geolocation_lat: 'float value for latitude',
// 		user: {
// 			user_id: 'id of user who made discovery',
// 			username: 'username of user who made discovery'
// 		}
// 	}
async function fetchDiscoveries(user_id) {
	try {
		const query = `
		SELECT 
			i.image_url,
			json_agg(
				DISTINCT jsonb_build_object(
					'animal_id', a.id,
					'animal_name', a.name
				)
			) AS animals,
			i.geolocation_long,
			i.geolocation_lat,
			jsonb_build_object(
				'user_id', u.id,
				'username', u.username
			) AS user
		FROM identifications i
		JOIN animals a ON i.animal_id = a.id
		JOIN users u ON i.user_id = u.id
		WHERE (u.is_private = false OR u.id = $1)
			AND (i.protected = false)
		GROUP BY i.image_url, u.id, u.username, i.geolocation_long, i.geolocation_lat
		ORDER BY MAX(i.created_at) DESC;
		`;

		const result = await db.query(query, [user_id]);

		return result.rows;
	} catch (error) {
		console.error(error);
		throw new Error('Error fetching sightings for map');
	}
}

async function followAnimal(user_id, animal_id) {
	try {
		const query = 'INSERT INTO followed_animals (user_id, animal_id) VALUES ($1, $2)';

		const result = await db.query(query, [user_id, animal_id]);

		return result.rowCount > 0;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to follow animal');
	}
}

export const discoveryRepository = {
	getAllAnimals,
	addNewBestiaryEntry,
	fetchAnimalImage,
	fetchDiscoveries,
	followAnimal,
};
