import { PostService } from "../services/PostService";

async function handleFetchAllSightings( identificationId, description, shareLocation, image) {
    try {
        
        const result = await PostService.fetchAllSightings(createPostRequest);

        return { success: true, result };
    } catch(error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to create post",
        };
    }
}

export const PostService = {
	createPost,
	fetchPost,
	fetchUsersPosts,
	fetchAllPosts,
	likePost,
	addComment,
};