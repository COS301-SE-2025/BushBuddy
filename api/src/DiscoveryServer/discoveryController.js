import { discoveryService } from './discoveryService.js';

async function getAllAnimals(req, res) {
	try {
		const animals = await discoveryService.getAllAnimals();

		return res.status(200).json({
			success: true,
			message: 'Animals retrieved successfully',
			data: animals,
		});
	} catch (error) {
		console.error('Error in getAllAnimals controller:', error);
		return res.status(500).json({
			success: false,
			error: 'Internal server error',
		});
	}
}

async function getMapSightings(req, res) {
	try {
		return res.status(501).json({
			success: true,
			message: 'Feature not yet implemented',
			data: [],
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: 'Internal server error',
		});
	}
}

export const discoveryController = {
	getAllAnimals,
	getMapSightings,
};
