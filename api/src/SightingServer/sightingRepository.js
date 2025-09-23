import db from '../db/index.js';
import { nanoid } from 'nanoid';
import s3 from '../db/imageStorage.js';

async function uploadSightingFile(file) {
	try {
		const key = nanoid(12);
		return await s3.storeImage(key, file);
	} catch (error) {
		console.error(error);
		throw new Error('Error uploading file');
	}
}

//temp function
async function saveNewSight(user_id, animal, confidence, image_url, file_type, geolocation) {
	try {
		const animalIdQuery = `SELECT id FROM animals WHERE name=$1;`;
		const animalResult = await db.query(animalIdQuery, [animal]);

		if (animalResult.rows.length === 0) {
			throw new Error(`Animal '${animal}' not found in the database.`);
		}

		const animal_id = animalResult.rows[0]?.id;

        const longitude = geolocation.longitude || null;
        const latitude = geolocation.latitude || null;

		let result=null;

		if(longitude === ('null'||null) || latitude === ('null'||null)) {
			const query =
				`INSERT INTO identifications (user_id, animal_id, confidence, method, image_url) 
				VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
			const params = [user_id, animal_id, confidence, file_type, image_url];

			result = await db.query(query, params);
		} else {
			const query =
				`INSERT INTO identifications (user_id, animal_id, confidence, method, image_url, geolocation_long, geolocation_lat) 
				VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`;
			const params = [user_id, animal_id, confidence, file_type, image_url, longitude, latitude];

			result = await db.query(query, params);
		}

		return result;
	} catch (error) {
		console.error(error);
		throw new Error('Error adding sighting to DB');
	}
}

async function saveNewSighting(user_id, identification, image_url, file_type, geolocation) {
	try {
		const { animal_id, confidence, confirmed, prot } = identification;
		const { longitude, latitude } = geolocation;
		const query =
			'INSERT INTO identifications (user_id, animal_id, confidence, confirmed, protected, method, image_url, geolocation_long, geolocation_lat) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;';
		const params = [user_id, animal_id, confidence, confirmed, prot, file_type, image_url, longitude, latitude];

		const result = await db.query(query, params);

		return result;
	} catch (error) {
		console.error(error);
		throw new Error('Error adding sighting to DB');
	}
}

async function fetchSightingImage(key) {
	try {
		return await s3.fetchImage(key);
	} catch (error) {
		console.error(error);
		throw new Error('Error fetching sighting image');
	}
}

async function fetchAllSightings() {
    try {
		//add filters for sightings 
		const query = `SELECT * FROM identifications ORDER BY created_at DESC LIMIT 25;`;

        const result = await db.query(query);

		return result.rows;
	} catch (error) {
		throw new Error(`Error fetching all sightings: ${error.message}`);
	}
}

export const sightingRepository = {
	uploadSightingFile,
	saveNewSight,
	saveNewSighting,
	fetchSightingImage,
	fetchAllSightings,
};
