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

async function fetchUserSightingsAmount(user_id) {
	try {
		const allSightings = await sightingRepository.fetchAllUserSightings(user_id);

		const amount = allSightings.rows.length;

		return amount;
	} catch (error) {
		console.error("Error in sightingService.fetchUserSightingsAmount:", error);
		throw new Error('Failed to fetch amount of posts');
	}
}

async function fetchUserAchievements(user_id) {
	try {
		const sightings = await sightingRepository.fetchAllUserSightingsWithAnimalNames(user_id);
		const userSightings = sightings.rows;

		let antelope_arr = [2,8,6,7,35,1,34,36,33,37,4,5,61,3];
		let predators_arr = [17,19,21,22,20,18];
		let small_mammals_arr = [27,29,39,2,23,31,30,28,25,32,38];
		let all_arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41];
		let big_five_arr = ["RHINO", "LION", "LEOPARD", "ELEPHANT", "BUFFALO"];

		let achievements = {
			antelopes : 0,
			antelopes_amount : antelope_arr.length,
			predators : 0,
			predators_amount : predators_arr.length,
			small_mammals : 0,
			small_mammals_amount : small_mammals_arr.length,
			all : 0,
			all_amount : all_arr.length,
			big_five : 0,
			big_five_amount : 5,
			total_completed : 0,
			total : 5
		}

		for(const sighting of userSightings){
			const animalId = sighting.animal_id;
			let animal_name = sighting.name.toUpperCase();

			if(antelope_arr.includes(animalId)){
				antelope_arr = antelope_arr.filter(animal => animal !== animalId);
				achievements.antelopes += 1;

				if(achievements.antelopes>=achievements.antelopes_amount){
					total_completed += 1;
				}
			}

			if(predators_arr.includes(animalId)){
				predators_arr = predators_arr.filter(animal => animal !== animalId);
				achievements.predators += 1;

				if(achievements.predators>=achievements.predators_amount){
					total_completed += 1;
				}
			}

			if(small_mammals_arr.includes(animalId)){
				small_mammals_arr = small_mammals_arr.filter(animal => animal !== animalId);
				achievements.small_mammals += 1;

				if(achievements.small_mammals>=achievements.small_mammals_amount){
					total_completed += 1;
				}
			}

			if(all_arr.includes(animalId)){
				all_arr = all_arr.filter(animal => animal !== animalId);
				achievements.all += 1;

				if(achievements.all>=achievements.all_amount){
					total_completed += 1;
				}
			}
			
			for(const big of big_five_arr){
				if(animal_name.includes(big)){
					big_five_arr = big_five_arr.filter(animal => animal !== big);
					achievements.big_five += 1;

					if(achievements.big_five>=achievements.big_five_amount){
						total_completed += 1;
					}
				}
			}
		}



		return achievements;
	} catch (error) {
		console.error("Error in sightingService.fetchUserSightingsAmount:", error);
		throw new Error('Failed to fetch user achievements');
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
				result.post.geoLocation = await sightingRepository.fetchGeoLocation(result.post.identification_id);

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
	fetchUserSightingsAmount,
	fetchUserAchievements,
	fetchPost,
	fetchSighting,
	formatTimestamp
};
