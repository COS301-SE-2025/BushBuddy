import db from '../db/index.js';
import { nanoid } from 'nanoid';
import s3 from '../db/imageStorage.js';

async function createPost(image, details) {
    try {
		const key = nanoid(12);
		const image_url = await s3.storeImage(key, image);

		const { 
			user_id, 
			identification_id, 
			description, 
			share_location 
		} = details;

		const query =
			`INSERT INTO posts (
				user_id, 
				identification_id, 
				image_url, 
				description, 
				share_location
				) VALUES ($1, $2, $3, $4, $5) RETURNING (postId);`;
		const params = [
			user_id, 
			identification_id, 
			image_url, 
			description, 
			share_location
		];

        result = await db.query(query, params);
        
		return result;
	} catch (error) {
		console.error(error);
		throw new Error(`Error adding new post: ${error.message}`);
	}
}

async function fetchPost(post_id) {
    try {
		const query = `SELECT * FROM posts WHERE id = ${post_id};`;
        const post = await db.query(query);
		const comments = await fetchComments(post_id);

		const result = {
			post,
			comments
		}

		return result;
	} catch (error) {
		console.error(error);
		throw new Error(`Error fetching post: ${error.message}`);
	}
}

async function fetchAllUserPosts(user_id) {
    try {
		const query = `SELECT * FROM posts WHERE post_id = ${user_id} ORDER BY created_at DECS;`;

        result = await db.query(query);

		return result;
	} catch (error) {
		console.error(error);
		throw new Error(`Error fetching all posts: ${error.message}`);
	}
}

async function fetchAllPosts() {
    try {
		const query = 
			`SELECT *
			FROM posts
			ORDER BY created_by DESC, created_at DESC
			LIMIT 50;`;

        result = await db.query(query);

		return result;
	} catch (error) {
		console.error(error);
		throw new Error(`Error fetching all posts: ${error.message}`);
	}
}

async function likePost(post_id, user_id) {
    try {
		const query = 'INSERT INTO likes (user_id, post_id) VALUES ($1, $2);';
		const params = [user_id, post_id];

        const result = await db.query(query, params);

		return result;
	} catch (error) {
		console.error(error);
		throw new Error(`Error adding like to post: ${error.message}`);
	}
}

async function addComment(details) {
    try {
		const { 
			user_id,
			post_id,
			comment_text
		} = details;

		const query = 'INSERT INTO comments (user_id, post_id, comment_text) VALUES ($1, $2, $3);';
		const params = [
			user_id,
			post_id,
			comment_text
		]

        const result = await db.query(query,params);

		return result;
	} catch (error) {
		console.error(error);
		throw new Error(`Error adding comment to post: ${error.message}`);
	}
}

async function fetchComments(post_id) {
    try {
		const query = `SELECT * FROM comments WHERE post_id = ${post_id} ORDER BY created_at DECS;`;

        const result = await db.query(query);

		return result;
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
    fetchAllUserPosts,
    fetchAllPosts,
    likePost,
    addComment,
    fetchPostImage
};