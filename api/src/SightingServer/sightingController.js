async function createSighting(req, res) {
	try {
		return res.status(501).json({
			success: true,
			message: 'Feature not yet implemented',
			data: [],
		});
	} catch (error) {
		console.error('Error handling new sighting: ', error);
		return res.status(500).json({
			success: false,
			error: 'Internal server error',
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
