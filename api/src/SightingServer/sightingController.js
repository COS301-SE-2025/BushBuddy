import { sightingService } from './sightingService.js';

const endangered = [
  "African Wild Dog",
  "Black Rhino",
  "Black Rhinoceros",
  "White Rhino",
  "White Rhinoceros",
  "Cheetah",
  "Elephant",
  "Leopard",
  "Lion",
  "Pangolin"
]

async function createSighting(req, res) {
	try {
		const user_id = req.user.id;
		const longitude = req.body.longitude;
		const latitude = req.body.latitude;
		const confidence = req.body.confidence;
		const animal = req.body.animal;
		if (!req.file || !animal || !confidence) {
			return res.status(400).json({ success: false, message: 'Some required fields are missing' });
		}

		if(endangered.includes(animal) && (longitude!=null||latitude!=null))
		{
			return res.status(400).json({ success: false, message: 'Failed to create sighting since endangered animal was passed with geolocation' });
		}

		// uploaded image, stored as a JS Buffer object (binary data)
		const image = req.file.buffer;
		//change createSight to createSighting once confirmed
		const result = await sightingService.createSight(user_id, animal, confidence, image, { longitude, latitude });
		if (!result) {
			return res.status(400).json({ success: false, message: 'Failed to create sighting with given data' });
		}

		return res.status(200).json({ success: true, message: 'Successfully created new sighting', data : {
			identification_id: result.identification_id
		} });
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
		if (!req.params.id) {
			return res.status(400).json({ success: false, message: 'Sighting ID is required' });
		}

		const sight_id = parseInt(req.params.id, 10);

		const result = await sightingService.fetchSighting(sight_id);

		if (!result) {
			return res.status(400).json({
				success: false,
				message: 'Failed to fetch sighting',
			});
		}

		return res.status(201).json({
			success: true,
			message: 'Sighting fetched successfully',
			data: result,
		});
	} catch (error) {
		console.error('Error fetching sighting: ', error);
		res.status(500).json({
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

async function fetchPost(req, res) {
	try {
		if (!req.params.id) {
			return res.status(400).json({ success: false, message: 'Sighting ID is required' });
		}

		const sight_id = parseInt(req.params.id, 10);
		
		const user = req.user;

		const result = await sightingService.fetchPost(user.id, sight_id);

		if (!result) {
			return res.status(400).json({
				success: false,
				message: 'Failed to fetch post',
			});
		}

		return res.status(201).json({
			success: true,
			message: 'Post fetched successfully',
			data: result,
		});
	} catch (error) {
		console.error('Error fetching post: ', error);
		res.status(500).json({
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
			sightings: result
		});
	} catch (error) {
		console.error('Error fetching all sightings: ', error);
		res.status(500).json({
			success: false,
			error: 'Internal server error',
		});
	}
}

async function fetchUserSightingsAmount(req, res) {
	try {
		const user = req.user;
		
		const amount = await sightingService.fetchUserSightingsAmount(user.id);

		if(!(amount>-1)){
			return res.status(400).json({
				success: false,
				message: 'Failed to fetch user sightings amount'
			});
		}

		return res.status(200).json({
			success:true,
			message: 'Sightings amount fetched successfully',
			amount_sightings: amount
		});
	} catch (error) {
		console.error('Error fetching amount of sightings: ', error);
		res.status(500).json({
			success: false,
			error: 'Internal server error',
		});
	}
}

async function fetchUserAchievements(req, res) {
	try {
		const user = req.user;
		
		const achievements = await sightingService.fetchUserAchievements(user.id);

		if(!achievements){
			return res.status(400).json({
				success: false,
				message: 'Failed to fetch user achievements'
			});
		}

		return res.status(200).json({
			success:true,
			message: 'User achievements fetched successfully',
			user_achievements: achievements
		});
	} catch (error) {
		console.error('Error fetching user achievements: ', error);
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
	fetchPost,
	fetchAllSightings,
	fetchUserSightingsAmount,
	fetchUserAchievements,
};
