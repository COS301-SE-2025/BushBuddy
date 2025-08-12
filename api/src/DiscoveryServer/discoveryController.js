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
		if (!req.file) {
			return res.status(400).json({ success: false, message: 'No image uploaded' });
		}
		if (!req.user.admin) {
			return res.status(401).json({ success: false, message: 'You are not authorised to perform this action' });
		}
		const image = req.file.buffer;
		const details = { name: req.body.name, type: req.body.type || 'n/a', description: req.body.description || 'none' };

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
		const user_id = req.user.id;

		const result = await discoveryService.fetchDiscoveries(user_id);

		if (!result || result.length === 0) {
			return res.status(200).json({ success: true, message: 'No discoveries found' });
		}

		return res.status(200).json({ success: true, message: 'Successfully fetched all discoveries', data: result });
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Failed to fetch discoveries',
		});
	}
}

async function followAnimal(req, res) {
	try {
		const user_id = req.user.id;
		const animal_id = req.body.animal_id;

		const success = await discoveryService.followAnimal(user_id, animal_id);

		if (!success) {
			return res.status(200).json({ success: false, message: "Couldn't follow animal" });
		}

		return res.status(200).json({ success: true, message: 'Followed animal' });
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Failed to follow animal' });
	}
}

export const discoveryController = {
	getAllAnimals,
	getMapSightings,
	insertNewAnimal,
	followAnimal,
};
