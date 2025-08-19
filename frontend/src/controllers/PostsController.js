import { PostService } from "../services/PostService";

import {
	CreatePostRequest,
	FetchAllPostsRequest,
	LikePostRequest,
	AddCommentRequest,
} from "../models/PostModel";

async function handleCreatePost( identificationId, description, shareLocation, image) {
    try {
        const createPostRequest = new CreatePostRequest({
            identificationId,
            description,
            shareLocation,
            image
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

//add input params
async function handleFetchAllPosts( ) {
    try {
        //add input params
        const fetchAllPostsRequest = new FetchAllPostsRequest({ });
        const result = await PostService.fetchAllPosts();

        return { success:true, posts:result };
    } catch(error) {
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

export const PostsController = {
    handleCreatePost,
    handleFetchAllPosts,
    handleFetchPost,
    handleFetchUsersPosts,
    handleLikePost,
    handleCommentPost
};