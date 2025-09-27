import apiClient from "./apiClient";
import {
    Post,
    CreatePostRequest,
    FetchAllPostsRequest,
    LikePostRequest,
    CommentPostRequest
} from "../models/PostModel";

async function createPost(createPostRequest) {
    const response = await apiClient.post("/posts/", createPostRequest);
    return response.data;
}

//add params and filters to fetchAllPostsRequest model
async function fetchAllPosts(filter) {
    const response = await apiClient.get(`/posts/all/${filter}`);
    const results = response.data;
    const postsBefore = results.data;

    const posts = [];
    for (const result of postsBefore) {
        posts.push(new Post({
            id: result.id,
            user_id: result.user_id,
            image_url: result.image_url,
            identificationId: result.identificationId,
            description: result.description,
            shareLocation: result.shareLocation,
            is_removed: result.is_removed,
            created_at: result.created_at,
            likes: result.likes,
            isLiked: result.isLiked,
            comments: result.comments
        }));
    }

    return posts;
}

async function fetchPost(postId) {
    const response = await apiClient.get(`/posts/${postId}`);
    return response.data;
}

async function fetchUsersPosts() {
    const response = await apiClient.get("/posts/userPosts");
    return response.data.result;
}

async function likePost(likePostRequest) {
    const { postId } = likePostRequest;
    const response = await apiClient.post(`/posts/${postId}/like`);
    return response.success;
}

async function addComment(commentPostRequest) {
    const { postId, ...body} = commentPostRequest;
    const response = await apiClient.post(`/posts/${postId}/comment`, body);
    return response.success;
}

async function deletePost( postId ) {
    const response = await apiClient.delete(`/posts/${postId}`);
    return response.success;
}

export const PostService = {
	createPost,
	fetchPost,
	fetchUsersPosts,
	fetchAllPosts,
	likePost,
	addComment,
    deletePost,
};