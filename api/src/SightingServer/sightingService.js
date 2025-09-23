import { sightingRepository } from './sightingRepository.js';

//temp function
async function createSight(user_id, animal, confidence, file, geolocation) {
	try {
		console.log(user_id, animal, confidence, file, geolocation);
		const image_url = await sightingRepository.uploadSightingFile(file);

		const result = await sightingRepository.saveNewSight(user_id, animal, confidence, image_url, 'image', geolocation);

		return { identification_id: result.rows[0].id };
	} catch (error) {
		if (error !== 'Error uploading file' || error !== 'Error adding sighting to DB') console.error(error);
		throw new Error('Failed to create new sighting');
	}
}

async function createSighting(user_id, file, geolocation) {
	// add AI integration here using [file] parameter
	// file is stored as a JS Buffer object (binary data)
	// save result in identifications array as an object(s), e.g. [{animal: "Impala", confidence: 85}, {animal: "Warthog", confidence: 90}] or [{animal: "Elephant", confidence: 97.5}]
	const identifications = [];

	try {
		// in future check whether file is image or audio
		const image_url = await sightingRepository.uploadSightingFile(file);
		const sightings = [];

		for (const identification of identifications) {
			sightings.push(
				await sightingRepository.saveNewSighting(user_id, identification, image_url, 'image', geolocation)
			);
		}

		const image = await sightingRepository.fetchSightingImage(image_url);
		return { animals: sightings, image: image };
	} catch (error) {
		if (error !== 'Error uploading file' || error !== 'Error adding sighting to DB') console.error(error);
		throw new Error('Failed to create new sighting');
	}
}

async function fetchAllSightings() {
	try {
		//add filters for sightings 
		const allSightings = await sightingRepository.fetchAllSightings();

		return allSightings;
	} catch (error) {
		console.error("Error in sightingService.fetchAllSightings:", error);
		throw new Error('Failed to fetch all posts');
	}
}

export const sightingService = {
	createSight,
	createSighting,
	fetchAllSightings,
};
