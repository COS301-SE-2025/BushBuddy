import { postingRepository } from './postingRepository.js';

async function createPost(imageBuffer , details) {
    try{
        const result = await postingRepository.createPost(imageBuffer ,details);
        
        if (!result) {
            throw new Error();
        }

        return result;

    }catch (error){
        console.error(error);
        throw new Error('Failed to create post');
    }
}

async function fetchAllPosts() {
    try {
        const allPosts = await postingRepository.fetchAllPosts();

        for(const post of allPosts){
            //fetch image from storage
            post.image_url = await postingRepository.fetchPostImage(post.image_url);
            post.user_id = await postingRepository.fetchUserName(post.user_id);

            //edit date format
            const date = new Date(post.created_at);
            console.log(date.getDate() + " " + date.toLocaleString("en-US", { month: "long" }));
            post.created_at = date.getDate() + " " + date.toLocaleString("en-US", { month: "long" });
        }

        return allPosts;
    } catch (error) {
        console.error("Error in postingService.fetchAllPosts:", error);
        throw new error('Failed to fetch all posts');
    }
}

async function fetchAllUserPosts(user_id) {
    try {
        const allPosts = await postingRepository.fetchAllUserPosts(user_id);

        for(const post of allPosts){
            //fetch image from storage
            post.image_url = await postingRepository.fetchPostImage(post.image_url);
            post.post.user_id = await postingRepository.fetchUserName(post.user_id);

            //edit date format
            const date = new Date(post.created_at);
            console.log(date.getDate() + " " + date.toLocaleString("en-US", { month: "long" }));
            post.created_at = date.getDate() + " " + date.toLocaleString("en-US", { month: "long" });
        }

        return allPosts;
    } catch (error) {
        console.error("Error in postingService.fetchAllPosts:", error);
        throw new error('Failed to fetch all posts');
    }
}

async function fetchPost(post_id) {
    try{
        const result = await postingRepository.fetchPost(post_id);
        result.post.image_url = await postingRepository.fetchPostImage(result.post.image_url);
        result.post.user_id = await postingRepository.fetchUserName(result.post.user_id);

        const date = new Date(result.post.created_at);
        result.post.created_at = date.getDate() + " " + date.toLocaleString("en-US", { month: "long" });

        return result;
    } catch (error){
        console.error("Error in postingService.fetchPost:", error);
        throw new Error('Failed to fetch post');
    }
}

async function likePost(post_id, user_id){
    try {
        const result = await postingRepository.likePost(post_id, user_id);

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
    fetchAllUserPosts,
    fetchAllPosts,
    likePost,
    addComment,
};