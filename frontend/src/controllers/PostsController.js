import { PostService } from "../services/PostService";

import {
	CreatePostRequest,
	FetchAllPostsRequest,
	LikePostRequest,
	AddCommentRequest,
} from "../models/PostModel";

async function handleCreatePost( identification_id, description, share_location) {
    try {
        const createPostRequest = new CreatePostRequest({
            identification_id,
            description,
            share_location,
        });
        
        const result = await PostService.createPost(createPostRequest);

        return { success: true, result };
    } catch(error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to create post",
        };
    }
}

//add params for post amount ranges
async function handleFetchAllPosts(filter) {
    try {
        const fetchAllPostsRequest = new FetchAllPostsRequest({ filter });
        const result = await PostService.fetchAllPosts(filter);

        return { success: true, posts: result };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch all posts",
        };
    }
}

async function handleFetchPost( postId ) {
    try {
        const post = await PostService.fetchPost(postId);

        return { success:true, post };
    } catch(error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch post",
        };
    }
}

async function handleFetchUsersPosts( ) {
    try {
        const posts = await PostService.fetchUsersPosts();

        return { success:true, posts };
    } catch(error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch all users posts",
        };
    }
}

async function handleLikePost( postId ) {
    try {
        const likePostRequest = new LikePostRequest({ postId });
        const result = await PostService.likePost(likePostRequest);

        return { success:true, result };
    } catch(error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to like post",
        };
    }
}

async function handleCommentPost( postId, comment ) {
    try {
        const addCommentRequest = new AddCommentRequest({ postId, comment });
        const result = await PostService.addComment(addCommentRequest);

        return { success:true, result };
    } catch(error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to add comment to post",
        };
    }
}

async function handleDeletePost( postId ) {
    try {
        const result = await PostService.deletePost(postId);

        return { success:true, result };
    } catch(error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to delete post",
        };
    }
}

export const PostsController = {
    handleCreatePost,
    handleFetchAllPosts,
    handleFetchPost,
    handleFetchUsersPosts,
    handleLikePost,
    handleCommentPost,
    handleDeletePost
};