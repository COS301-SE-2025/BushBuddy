import { sightingService } from './sightingService.js';

/**
 * Handles the creation of a new animal sighting.
 * It processes the uploaded image and geolocation data from the request.
 */
async function createSighting(req, res) {
    try {
        // req.user is populated by the authentication middleware
        const user_id = req.user.id;
        const { longitude, latitude } = req.body;

        if (!req.file || !longitude || !latitude) {
            return res.status(400).json({ success: false, message: 'Some required fields are missing' });
        }

        const image = req.file.buffer;
        
        // The `await` keyword is now used to wait for the promise to resolve.
        const result = await sightingService.createSighting(user_id, image, { longitude, latitude });

        // The service now handles errors, so this check might be redundant but is good practice.
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

/**
 * Handles the retrieval of a single sighting by its ID.
 */
async function viewSighting(req, res) {
    try {
        const { sightingId } = req.params;

        if (!sightingId) {
            return res.status(400).json({ success: false, message: 'Sighting ID is required' });
        }

        const sighting = await sightingService.getSightingById(sightingId);

        if (!sighting) {
            return res.status(404).json({ success: false, message: 'Sighting not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Sighting retrieved successfully',
            data: sighting,
        });
    } catch (error) {
        console.error('Error handling view sighting: ', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
}

/**
 * Handles the retrieval of all sightings for the current authenticated user.
 */
async function viewHistory(req, res) {
    try {
        // Get the user ID from the authenticated request
        const user_id = req.user.id;

        if (!user_id) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        // Call the service to get the history for the user
        const history = await sightingService.getSightingHistoryByUserId(user_id);

        return res.status(200).json({
            success: true,
            message: 'Sighting history retrieved successfully',
            data: history,
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