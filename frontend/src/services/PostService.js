import apiClient from "./apiClient";
import {
    Post,
    CreatePostRequest,
    FetchAllPostsRequest,
    LikePostRequest,
    CommentPostRequest
} from "../models/PostModel";

async function createPost(createPostRequest) {
    const response = await apiClient.post("/posts", createPostRequest);
    return response.data;
}

//add params and filters to fetchAllPostsRequest model
async function fetchAllPosts() {
    const response = await apiClient.get("/posts/all");
    return response.data;
}

async function fetchPost(postId) {
    const response = await apiClient.get(`/posts/${postId}`);
    return response.data;
}

async function fetchUsersPosts() {
    const response = await apiClient.get("/posts/userPosts");
    return response.data;
}

async function likePost(likePostRequest) {
    const { postId, ...body} = likePostRequest;
    const response = await apiClient.get(`/posts/${postId}/like`);
    return response.success;
}

async function addComment(commentPostRequest) {
    const { postId, ...body} = commentPostRequest;
    const response = await apiClient.get(`/posts/${postId}/comment`, body);
    return response.success;
}

export const PostService = {
	createPost,
	fetchPost,
	fetchUsersPosts,
	fetchAllPosts,
	likePost,
	addComment,
};