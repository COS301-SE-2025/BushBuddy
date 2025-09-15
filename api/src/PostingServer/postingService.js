import { postingRepository } from './postingRepository.js';

async function createPost(details) {
    try{
        const result = await postingRepository.createPost(details);

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
            post.image_url = await postingRepository.fetchPostImage(post.image_url);
            post.user_id = await postingRepository.fetchUserName(post.user_id);
            post.created_at = await formatTimestamp(post.created_at);
        }

        return allPosts;
    } catch (error) {
        console.error("Error in postingService.fetchAllPosts:", error);
        throw new Error('Failed to fetch all posts');
    }
}

async function fetchAllUserPosts(user_id) {
    try {
        const allPosts = await postingRepository.fetchAllUserPosts(user_id);

        for(const post of allPosts){
            post.image_url = await postingRepository.fetchPostImage(post.image_url);
            post.user_id = await postingRepository.fetchUserName(post.user_id);
            post.created_at = await formatTimestamp(post.created_at);
        }

        return allPosts;
    } catch (error) {
        console.error("Error in postingService.fetchAllPosts:", error);
        throw new Error('Failed to fetch user posts');
    }
}

async function fetchPost(post_id) {
    try{
        const result = await postingRepository.fetchPost(post_id);

        if(!result)
        {
            return null;
        }

        result.post.image_url = await postingRepository.fetchPostImage(result.post.image_url);
        result.post.user_id = await postingRepository.fetchUserName(result.post.user_id);
        result.post.created_at = await formatTimestamp(result.post.created_at);

        for(const comment of result.comments){
            comment.user_id = await postingRepository.fetchUserName(comment.user_id);
        }

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
        throw new Error('Failed to add comment');
    }
}

async function formatTimestamp(timestamp){
    const date = new Date(timestamp);

    const dayMonth = date.getDate() + " " + date.toLocaleString("en-US", { month: "long" }) + " " + date.getFullYear();
    const newTime = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

    const output = `${dayMonth} ${newTime}`;
    return output;
}

export const postingService = {
    createPost,
    fetchPost,
    fetchAllUserPosts,
    fetchAllPosts,
    likePost,
    addComment,
};