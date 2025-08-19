import apiClient from "./apiClient";

async function fetchAllSightings() {
    const response = await apiClient.post("/sightings/all");
    return response.data;
}