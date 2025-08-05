import { discoveryRepository } from './discoveryRepository.js';

async function getAllAnimals() {
	try {
		const animals = await discoveryRepository.getAllAnimals();

		// Add any business logic here if needed
		// For example: filtering, sorting, data transformation, etc.

		// Sort animals alphabetically by name (fallback sorting in case DB doesn't sort)
		const sortedAnimals = animals.sort((a, b) => a.name.localeCompare(b.name));

		return sortedAnimals;
	} catch (error) {
		console.error('Error in bestiaryService.getAllAnimals:', error);
		throw new Error('Failed to retrieve animals from service layer');
	}
}

export const discoveryService = {
	getAllAnimals,
};
