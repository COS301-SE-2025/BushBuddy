import db from '../db/index.js';
import { nanoid } from 'nanoid';
import s3 from '../db/imageStorage.js';

async function createPost(image, details) {
    try {
		const key = nanoid(12);
		const url = await s3.storeImage(key, image);

		const { name, description, shareLocation } = details;

		const query =
			'INSERT INTO posts (name, description, shareLocation, image_url) VALUES ($1, $2, $3, $4) RETURNING (postId);';
		const params = [name, description, shareLocation, url];

        result = await db.query(query, params);
        
		return result
	} catch (error) {
		console.error(error);
		throw new Error(`Error adding new post: ${error.message}`);
	}
}

//fetch all or fetch only what we need?
async function fetchPost(id) {
    try {
		const query = 'SELECT * FROM posts WHERE id = $1;';
		const params = [id];

        result = await db.query(query, params);

		return result
	} catch (error) {
		console.error(error);
		throw new Error(`Error fetching post: ${error.message}`);
	}
}

async function fetchAllPosts() {
    try {
		const query = 'SELECT * FROM posts ORDER BY created_at ASC;';

        result = await db.query(query);

		return result
	} catch (error) {
		console.error(error);
		throw new Error(`Error fetching all posts: ${error.message}`);
	}
}

//likes and comments table??
async function likePost() {
    try {
		const query = '';

        result = await db.query(query);

		return result
	} catch (error) {
		console.error(error);
		throw new Error(`Error adding like to post: ${error.message}`);
	}
}

async function addComment(data) {
    try {
		const query = '';

        result = await db.query(query);

		return result
	} catch (error) {
		console.error(error);
		throw new Error(`Error adding like to post: ${error.message}`);
	}
}

async function fetchPostImage(key) {
    try {
		const url = await s3.fetchImage(key);
		return url;
	} catch (error) {
		console.error(error);
		throw new Error('Error fetching post image');
	}
}

export const postingService = {
    createPost,
    fetchPost,
    fetchAllPosts,
    likePost,
    addComment,
    fetchPostImage
};