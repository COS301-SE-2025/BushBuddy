import { SightingService } from "../services/SightingService";

async function handleFetchAllSightings( ) {
    try {
        const result = await SightingService.fetchAllSightings();

        //add in sightingsModel

        return { success: true, result };
    } catch(error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch sightings",
        };
    }
}

export const SightingsController = {
	handleFetchAllSightings
};