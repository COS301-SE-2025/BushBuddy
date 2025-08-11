import { sightingRepository } from './sightingRepository';

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

export const sightingService = {
	createSighting,
};
