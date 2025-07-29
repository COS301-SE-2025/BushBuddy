import { discoveryService } from './discoveryService.js';

async function getAllAnimals(req, res) {
	try {
		const animals = await discoveryService.getAllAnimals();

		return res.status(200).json({
			success: true,
			message: 'Animals retrieved successfully',
			data: animals,
			count: animals.length,
		});
	} catch (error) {
		console.error('Error in getAllAnimals controller:', error);
		return res.status(500).json({
			success: false,
			message: 'Internal server error while retrieving animals',
			error: process.env.NODE_ENV === 'development' ? error.message : undefined,
		});
	}
}

export const discoveryController = {
	getAllAnimals,
};
