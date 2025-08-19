import { sightingService } from './sightingService.js';

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
		const result = sightingService.createSighting(user_id, image, { longitude, latitude });

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

async function fetchAllSightings(req, res) {
	try {
		//add filters for sightings
		
		const result = await sightingService.fetchAllSightings();

		if(!result){
			return res.status(400).json({
				success: false,
				message: 'Failed to fetch Sightings'
			});
		}

		if(result.rows==0){
			return res.status(204).json({ 
				success: true, 
				message: 'No Sightings found with specified filters' 
			});
		}

		return res.status(200).json({
			success:true,
			message: 'Sightings fetched successfully',
			data: result
		});
	} catch (error) {
		console.error('Error fetching all sightings: ', error);
		res.status(500).json({
			success: false,
			error: 'Internal server error',
		});
	}
}

export const sightingController = {
	createSighting,
	viewSighting,
	viewHistory,
	fetchAllSightings,
};
