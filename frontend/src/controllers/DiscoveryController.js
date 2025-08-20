import { DiscoveryService } from "../services/DiscoveryService";

async function handleFetchBestiaryAnimals( ) {
    try {
        const result = await DiscoveryService.fetchBestiaryAnimals();

        return { success: true, result };
    } catch(error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch bestiary",
        };
    }
}

export const DiscoveryController = {
    handleFetchBestiaryAnimals
};