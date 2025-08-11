import { sightingRepository } from './sightingRepository';

async function createSighting(user_id, identifications, file, geolocation) {
	try {
		// in future check whether file is image or audio
		const image_url = await sightingRepository.uploadSightingFile(file);
		const sightings = [];
		if (Array.isArray(identifications)) {
			for (const identification of identifications) {
				sightings.push(
					await sightingRepository.saveNewSighting(user_id, identification, image_url, 'image', geolocation)
				);
			}
		} else {
			// call repo function on single identification
			sightings.push(
				await sightingRepository.saveNewSighting(user_id, identifications, image_url, 'image', geolocation)
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
