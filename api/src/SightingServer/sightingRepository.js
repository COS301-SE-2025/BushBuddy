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
		const query = `SELECT * FROM identifications LIMIT 50;`;

        const result = await db.query(query);

		return result.rows;
	} catch (error) {
		throw new Error(`Error fetching all sightings: ${error.message}`);
	}
}

export const sightingRepository = {
	uploadSightingFile,
	saveNewSighting,
	fetchSightingImage,
	fetchAllSightings,
};
