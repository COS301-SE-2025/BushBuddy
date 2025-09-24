import { sightingRepository } from './sightingRepository.js';

//temp function
async function createSight(user_id, animal, confidence, file, geolocation) {
	try {
		console.log(user_id, animal, confidence, file, geolocation);
		const image_url = await sightingRepository.uploadSightingFile(file);

		const result = await sightingRepository.saveNewSight(user_id, animal, confidence, image_url, 'image', geolocation);

		return { identification_id: result.rows[0].id };
	} catch (error) {
		if (error !== 'Error uploading file' || error !== 'Error adding sighting to DB') console.error(error);
		throw new Error('Failed to create new sighting');
	}
}

async function createSighting(user_id, file, geolocation) {
	// add AI integration here using [file] parameter
	// file is stored as a JS Buffer object (binary data)
	// save result in identifications array as an object(s), e.g. [{animal: "Impala", confidence: 85}, {animal: "Warthog", confidence: 90}] or [{animal: "Elephant", confidence: 97.5}]
	const identifications = [];

	try {
		// in future check whether file is image or audio
		const image_url = await sightingRepository.uploadSightingFile(file);
		const sightings = [];

		for (const identification of identifications) {
			sightings.push(
				await sightingRepository.saveNewSighting(user_id, identification, image_url, 'image', geolocation)
			);
		}

		const image = await sightingRepository.fetchSightingImage(image_url);
		return { animals: sightings, image: image };
	} catch (error) {
		if (error !== 'Error uploading file' || error !== 'Error adding sighting to DB') console.error(error);
		throw new Error('Failed to create new sighting');
	}
}

async function fetchAllSightings() {
	try {
		//add filters for sightings 
		const allSightings = await sightingRepository.fetchAllSightings();

		return allSightings;
	} catch (error) {
		console.error("Error in sightingService.fetchAllSightings:", error);
		throw new Error('Failed to fetch all posts');
	}
}

async function fetchPost(user_id, sight_id) {
	try{
		const result = await sightingRepository.fetchPost(sight_id);

		if(!result)
		{
			return null;
		}

		const post_id = result.id;

		result.post.image_url = await sightingRepository.fetchSightingImage(result.post.image_url);
		result.post.user_id = await sightingRepository.fetchUserName(result.post.user_id);
		result.post.created_at = await formatTimestamp(result.post.created_at);
		result.post.isLiked = await sightingRepository.checkLikedStatus(user_id, post_id);

		for(const comment of result.comments){
			comment.user_id = await sightingRepository.fetchUserName(comment.user_id);
		}

		return result;
	} catch (error){
		console.error("Error in sightingService.fetchPost:", error);
		throw new Error('Failed to fetch post');
	}
}

async function fetchSighting(sight_id) {
	try{
		const result = await sightingRepository.fetchSighting(sight_id);

		if(!result)
		{
			return null;
		}

		result.image_url = await sightingRepository.fetchSightingImage(result.image_url);
		result.user_id = await sightingRepository.fetchUserName(result.user_id);
		result.animal_id = await sightingRepository.fetchAnimalName(result.animal_id);
		result.created_at = await formatTimestamp(result.created_at);
		
		return result;
	} catch (error){
		console.error("Error in sightingService.fetchSighting:", error);
		throw new Error('Failed to fetch post');
	}
}

async function formatTimestamp(timestamp){
    const date = new Date(timestamp);

    const dayMonth = date.getDate() + " " + date.toLocaleString("en-US", { month: "long" }) + " " + date.getFullYear();
    const newTime = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

    const output = `${dayMonth} ${newTime}`;
    return output;
}

export const sightingService = {
	createSight,
	createSighting,
	fetchAllSightings,
	fetchPost,
	fetchSighting,
	formatTimestamp
};
