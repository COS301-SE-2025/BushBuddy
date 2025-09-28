import apiClient from "./apiClient";

async function createSighting(formData) {
    const response = await apiClient.post("/sightings/", formData, {
        headers: {
        "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

async function fetchAllSightings() {
    const response = await apiClient.get("/sightings/all");
    return response.data;
}

async function fetchUserSightingsAmount() {
    const response = await apiClient.get("/sightings/amount");
    return response.data.amount_sightings;
}

async function fetchUserAchievements() {
    const response = await apiClient.get("/sightings/achievements");
    return response.data.user_achievements;
}

async function fetchSightingDetails( id ) {
    const response = await apiClient.get(`/sightings/${id}`);
    return response.data;
}

async function fetchPostDetails( id ) {
    const response = await apiClient.get(`/sightings/post/${id}`);
    return response.data;
}

export const SightingService = {
    fetchSightingDetails,
    createSighting,
    fetchUserSightingsAmount,
    fetchUserAchievements,
    fetchAllSightings,
    fetchPostDetails,
}