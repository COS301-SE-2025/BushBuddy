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

async function fetchSighting(post_id) {
	try {
		const query = `SELECT * FROM identifications WHERE id = $1;`;
		const result = await db.query(query, [post_id]);

		if (result.rowCount == 0) return null;

		return result.rows[0];
	} catch (error) {
		throw new Error(`Error fetching sighting: ${error.message}`);
	}
}

async function fetchAllSightings() {
    try {
		//add filters for sightings 
		const query = `SELECT * FROM identifications ORDER BY created_at DESC LIMIT 5;`;

        const result = await db.query(query);

		return result.rows;
	} catch (error) {
		throw new Error(`Error fetching all sightings: ${error.message}`);
	}
}

async function fetchPost(identification_id) {
	try {
		const query = `SELECT * FROM posts WHERE identification_id = $1;`;
		const post = await db.query(query, [identification_id]);

		console.log(post);

		if (post.rowCount == 0) return null;

		const post_id = post.rows[0].id;

		const comments = await fetchComments(post_id);
		const result = {
			post: post.rows[0],
			comments,
		};

		return result;
	} catch (error) {
		throw new Error(`Error fetching post: ${error.message}`);
	}
}

async function fetchComments(post_id) {
	try {
		const query = `SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC;`;

		const result = await db.query(query, [post_id]);

		//update amount of comments in posts?

		return result.rows;
	} catch (error) {
		throw new Error(`Error adding like to post: ${error.message}`);
	}
}

async function checkLikedStatus(user_id, post_id) {
	try {
		const query = `SELECT * FROM likes WHERE user_id = $1 AND post_id = $2`;
		const exists = await db.query(query, [user_id, post_id]);

		return exists.rowCount > 0;
	} catch (error) {
		throw new Error(`Error checking liked status: ${error.message}`);
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

async function fetchUserName(userId) {
	try {
		const query = `SELECT username FROM users WHERE id = $1;`;

		const result = await db.query(query, [userId]);

		return result.rows[0].username;
	} catch (error) {
		throw new Error(`Error fetching username: ${error.message}`);
	}
}

async function fetchAnimalName(animalId) {
	try {
		const query = `SELECT name FROM animals WHERE id = $1;`;

		const result = await db.query(query, [animalId]);

		return result.rows[0].name;
	} catch (error) {
		throw new Error(`Error fetching animal name: ${error.message}`);
	}
}

export const sightingRepository = {
	uploadSightingFile,
	saveNewSight,
	saveNewSighting,
	fetchSighting,
	fetchAllSightings,
	fetchPost,
	fetchComments,
	checkLikedStatus,
	fetchSightingImage,
	fetchUserName,
	fetchAnimalName,
};
