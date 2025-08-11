import { sightingService } from './sightingService';

async function createSighting(req, res) {
	try {
		const user_id = req.user.id;
		const longitude = req.body.longitude;
		const latitude = req.body.latitude;
		if (!req.file || !longitude || !latitude) {
			return res.status(400).json({ success: false, message: 'Some required fields are missing' });
		}
		// uploaded image, stored as a JS Buffer object (binary data)
		const image = req.file.buffer;

		// add AI integration here using image buffer
		// return identified animal and confidence percentage as an object, e.g. {animal: "Elephant", confidence: 97.5}
		// if multiple different animals are identified return an array of objects, e.g. [{animal: "Impala", confidence: 85}, {animal: "Warthog", confidence: 90}]
		const identifications = []; // <- store result here

		const result = sightingService.createSighting(user_id, identifications, image, { longitude, latitude });
		if (!result) {
			return res.status(400).json({ success: false, message: 'Failed to create sighting with given data' });
		}

		return res.status(200).json({ success: true, message: 'Successfully created new sighting', data: result });
	} catch (error) {
		console.error('Error handling new sighting: ', error);
		return res.status(500).json({
			success: false,
			error: 'Error while trying to create a new sighting',
		});
	}
}

async function viewSighting(req, res) {
	try {
		return res.status(501).json({
			success: true,
			message: 'Feature not yet implemented',
			data: [],
		});
	} catch (error) {
		console.error('Error handling view sighting: ', error);
		return res.status(500).json({
			success: false,
			error: 'Internal server error',
		});
	}
}

async function viewHistory(req, res) {
	try {
		return res.status(501).json({
			success: true,
			message: 'Feature not yet implemented',
			data: [],
		});
	} catch (error) {
		console.error('Error handling sighting history: ', error);
		return res.status(500).json({
			success: false,
			error: 'Internal server error',
		});
	}
}

export const sightingController = {
	createSighting,
	viewSighting,
	viewHistory,
};
