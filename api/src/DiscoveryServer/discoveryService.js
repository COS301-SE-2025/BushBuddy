import { discoveryRepository } from './discoveryRepository.js';

async function getAllAnimals() {
	try {
		const animals = await discoveryRepository.getAllAnimals();

		// Add any business logic here if needed
		// For example: filtering, sorting, data transformation, etc.

		// Sort animals alphabetically by name (fallback sorting in case DB doesn't sort)
		let sortedAnimals = animals.sort((a, b) => a.name.localeCompare(b.name));

		// console.log(sortedAnimals);
		for (const animal of sortedAnimals) {
			animal.image_url = await discoveryRepository.fetchAnimalImage(animal.image_url);
		}

		return sortedAnimals;
	} catch (error) {
		console.error('Error in bestiaryService.getAllAnimals:', error);
		throw new Error('Failed to retrieve animals from service layer');
	}
}

async function addNewAnimal(details, image) {
	try {
		const result = await discoveryRepository.addNewBestiaryEntry(details, image);

		return result;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to add new animal to bestiary');
	}
}

async function fetchDiscoveries(user_id) {
	try {
		const discoveries = await discoveryRepository.fetchDiscoveries(user_id);
		if (discoveries.length > 0) {
			for (const discovery of discoveries) {
				discovery.image_url = await discoveryRepository.fetchAnimalImage(discovery.image_url);
			}
		}
		return discoveries;
	} catch (error) {
		if (error !== 'Error fetching sightings for map') console.error(error);
		throw new Error('Failed to fetch discoveries');
	}
}

async function followAnimal(user_id, animal_id) {
	try {
		const success = await followAnimal(user_id, animal_id);

		return success;
	} catch (error) {
		if (error !== 'Failed to follow animal') console.error(error);
		throw new Error('Failed to follow animal');
	}
}

export const discoveryService = {
	getAllAnimals,
	addNewAnimal,
	fetchDiscoveries,
	followAnimal,
};
