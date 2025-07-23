import { bestiaryRepository } from '../repositories/bestiaryRepository.js';

async function getAllAnimals() {
	try {
		const animals = await bestiaryRepository.getAllAnimals();

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

/* async function getAnimalById(id) {
	try {
		if (!id) {
			throw new Error('Animal ID is required');
		}

		const animal = await bestiaryRepository.getAnimalById(id);
		return animal;
	} catch (error) {
		console.error('Error in bestiaryService.getAnimalById:', error);
		throw new Error(`Failed to retrieve animal with ID ${id}`);
	}
}

async function searchAnimals(searchTerm) {
	try {
		if (!searchTerm || searchTerm.trim() === '') {
			throw new Error('Search term is required');
		}

		const animals = await bestiaryRepository.searchAnimals(searchTerm);
		return animals;
	} catch (error) {
		console.error('Error in bestiaryService.searchAnimals:', error);
		throw new Error('Failed to search animals');
	}
} */

export const bestiaryService = {
	getAllAnimals,
};
