import apiClient from "./apiClient";

async function fetchAllSightings() {
    const response = await apiClient.get("/sightings/all");
    return response.data;
}

export const SightingService = {
    fetchAllSightings,
}