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

export const SightingService = {
    createSighting,
    fetchAllSightings,
}