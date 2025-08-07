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
			message: 'Internal server error while retrieving animals',
		});
	}
}

async function insertNewAnimal(req, res) {
	try {
		const image = req.file.buffer;
		const details = { name: req.body.name, type: req.body.type, description: req.body.description };

		const result = await discoveryService.addNewAnimal(details, image);
		if (!result) {
			return res.status(400).json({
				success: false,
				message: 'Unable to add animal to bestiary',
			});
		}

		return res.status(200).json({
			success: true,
			message: `${details.name} added to bestiary`,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: 'Failed to add animal to bestiary',
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
			message: 'Internal server error',
		});
	}
}

export const discoveryController = {
	getAllAnimals,
	getMapSightings,
	insertNewAnimal,
};
