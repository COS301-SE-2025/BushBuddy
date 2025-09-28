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

async function handleFetchUserSightingsAmount( ) {
    try {
        const result = await SightingService.fetchUserSightingsAmount();

        return { success: true, amountOfSightings: result };
    } catch(error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch sightings amount",
        };
    }
}

async function handleFetchUserAchievements( ) {
    try {
        const result = await SightingService.fetchUserAchievements();

        return { success: true, achievements: result };
    } catch(error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch user achievements",
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
    handleFetchUserSightingsAmount,
    handleFetchUserAchievements,
    handleFetchSightingDetails,
    handleFetchPostDetails,
};