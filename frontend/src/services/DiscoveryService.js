import apiClient from "./apiClient";

async function fetchBestiaryAnimals() {
    const response = await apiClient.get("/discover/bestiary");
    return response.data;
}

export const DiscoveryService = {
    fetchBestiaryAnimals,
}