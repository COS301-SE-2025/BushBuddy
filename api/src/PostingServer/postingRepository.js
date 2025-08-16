import db from '../db/index.js';
import { nanoid } from 'nanoid';
import s3 from '../db/imageStorage.js';

async function createPost(imageBuffer, details) {
    try {
		const key = nanoid(12);
		const image_url = await s3.storeImage(key, imageBuffer);

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

async function fetchAllPosts() {
    try {
		const query = `SELECT * FROM posts ORDER BY created_at DESC LIMIT 50;`;

        const result = await db.query(query);

		return result.rows;
	} catch (error) {
		console.error(error);
		throw new Error(`Error fetching all posts: ${error.message}`);
	}
}

async function fetchPost(post_id) {
    try {
		const query = `SELECT * FROM posts WHERE id = $1;`;
        const post = await db.query(query, [post_id]);
		const comments = await fetchComments(post_id);

		const result = {
			post: post.rows[0],
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

async function likePost(post_id, user_id) {
    try {
		const queryCheck = `SELECT * FROM likes WHERE user_id = $1 AND post_id = $2`;
		const exists = await db.query(queryCheck, [user_id, post_id]);

		if (exists.rowCount == 0) {
			const query = 'INSERT INTO likes (user_id, post_id) VALUES ($1, $2);';
			const params = [user_id, post_id];

			const result = await db.query(query, params);

			return result;
		}
		
		return null;
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
		const query = `SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC;`;

        const result = await db.query(query, [post_id]);

		return result.rows;
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

async function fetchUserName(userId) {
	try {
		const query = `SELECT username FROM users WHERE id = $1;`;

        const result = await db.query(query, [userId]);

		return result.rows[0].username;
	} catch (error) {
		console.error(error);
		throw new Error(`Error fetching username: ${error.message}`);
	}
}

export const postingRepository = {
    createPost,
    fetchPost,
    fetchAllUserPosts,
    fetchAllPosts,
    likePost,
    addComment,
    fetchPostImage,
	fetchUserName
};