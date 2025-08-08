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

export const discoveryService = {
	getAllAnimals,
	addNewAnimal,
};
