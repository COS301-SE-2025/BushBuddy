import { SightingService } from "../services/SightingService";

async function handleCreateSighting(formData) {
    try {
        const result = await SightingService.createSighting(formData);
        return { success: true, result : result.data };
    } catch (error) {
        return {
        success: false,
        message: error.response?.data?.message || "Failed to create sighting",
        };
    }
}

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

async function handleFetchSightingDetails( id ) {
    try {
        const result = await SightingService.fetchSightingDetails( id );

        return { success: true, data: result.data };
    } catch(error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch sighting's details",
        };
    }
}

async function handleFetchPostDetails( id ) {
    try {
        const result = await SightingService.fetchPostDetails( id );

        return { success: true, data: result.data };
    } catch(error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch post's details",
        };
    }
}

export const SightingsController = {
    handleCreateSighting,
	handleFetchAllSightings,
    handleFetchSightingDetails,
    handleFetchPostDetails,
};