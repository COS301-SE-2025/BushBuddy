import { postingRepository } from './postingRepository.js';

async function createPost(image, details) {
    try{
        const result = await postintRepositiory.createPost(image,details);
        
        return result;

    }catch (error){
        console.error(error);
        throw new Error('Failed to create post');
    }
}

async function fetchPost(id) {
    try{
        const post = await postingRepository.fetchPost(id);
        post.image_url = await postingRepository.fetchPostImage(post.image_url);

        return post;
    } catch (error){
        console.error("Error in postingService.fetchPost:", error);
        throw new Error('Failed to fetch post');
    }
}

//add params for filtering and sorting?
async function fetchAllPosts() {
    try {
        const allPosts = await postingRepository.fetchAllposts();

        //sorted automatically by date
		let sortedPosts = animals.sort((a, b) => b.created_at.localeCompare(a.created_at));

        for(const post of sortedPosts){
            postingService.image_url = await postingRepository.fetchPostImage(post.image_url);
        }

        return allPosts;
    } catch (error) {
        console.error("Error in postingService.fetchAllPosts:", error);
        throw new error('Failed to fetch all posts');
    }
}

async function likePost(postId, userId){
    try {
        const result = await postingRepository.likePost(postId, userId);

        return result;
    } catch (error){
        console.error("Error in postingService.likePost:", error);
        throw new Error('Failed to like post');
    }
}

async function addComment(data) {
    try {
        const result = await postingRepository.addComment(data);

        return result;
    } catch (error){
        console.error("Error in postingService.likePost:", error);
        throw new Error('Failed to like post');
    }
}

export const postingService = {
    createPost,
    fetchPost,
    fetchAllPosts,
    likePost,
    addComment,
};