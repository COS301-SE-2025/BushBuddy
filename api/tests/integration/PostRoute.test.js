import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import db from '../../src/db/index.js';
import authApp from '../../src/AuthenticationServer/authRoute.js';
import postingApp from '../../src/PostingServer/postingRoute.js';
import jwt from 'jsonwebtoken';

const token = jwt.sign({ id: "rRhwe1Hz", username: 'example', admin: false }, process.env.JWT_SECRET);

let gatewayServer;
let authServer;
let postingServer;

const postIdToRemove = [];

beforeAll((done) => {
	const AUTH_PORT = process.env.AUTH_PORT || 4001;
	const POSTING_PORT = process.env.POSTING_PORT || 4004;
	const GATEWAY_PORT = process.env.PORT || 3000;

	authServer = authApp.listen(AUTH_PORT, () => {
		console.log(`✅ Auth service running on port ${AUTH_PORT}`);
		postingServer = postingApp.listen(POSTING_PORT, () => {
			console.log(`✅ Posting service running on port ${POSTING_PORT}`);
			gatewayServer = app.listen(GATEWAY_PORT, () => {
				console.log(`✅ API Gateway running on port ${GATEWAY_PORT}`);
				done();
			});
		});
	});
});

afterAll(async () => {
	await db.query("DELETE FROM comments WHERE post_id = ANY($1);",[postIdToRemove]);
	await db.query("DELETE FROM likes WHERE post_id = ANY($1);",[postIdToRemove]);
	await db.query("DELETE FROM posts WHERE id = ANY($1);",[postIdToRemove]);
	await new Promise((resolve) => gatewayServer.close(resolve));
	await new Promise((resolve) => authServer.close(resolve));
	await new Promise((resolve) => postingServer.close(resolve));
	await db.close();
});

beforeEach(async () => {
	await db.query("DELETE FROM comments WHERE post_id = ANY($1);",[postIdToRemove]);
	await db.query("DELETE FROM likes WHERE post_id = ANY($1);",[postIdToRemove]);
	await db.query("DELETE FROM posts WHERE id = ANY($1);",[postIdToRemove]);
});

describe('Posting Routes', () => {
	describe('POST / - Create Post', () => {
		test('should create a post successfully', async () => {
			const postData = {
				identification_id: 6,
				description: 'Beautiful elephant spotted in Kruger National Park',
				shareLocation: false
			};

			const res = await request(app)
				.post('/posts/')
				.set('Cookie', `token=${token}`)
				.send(postData);

			postIdToRemove.push(parseInt(res.body.data.id));

			console.log(postIdToRemove);

			expect(res.statusCode).toBe(201);
			expect(res.body).toHaveProperty('success', true);
			expect(res.body).toHaveProperty('message', 'Post created successfully');
			expect(res.body.data).toHaveProperty('id');
		});

		test('should fail without authentication', async () => {
			const postData = {
				identification_id: 6,
				description: 'Unauthorized post attempt'
			};

			const res = await request(app)
				.post('/posts/')
				.send(postData);

			expect(res.statusCode).toBe(401);
			expect(res.body).toHaveProperty('message', 'You must be logged in to perform this action');
		});
	});

	describe('GET /all - Fetch All Posts', () => {
		test('should fetch all posts successfully', async () => {
			// Create a test post first
			const createRes = await request(app)
				.post('/posts/')
				.set('Cookie', `token=${token}`)
				.send({
					identification_id: 6,
					description: 'Test post for fetching',
					shareLocation: false
				});

			postIdToRemove.push(parseInt(createRes.body.data.id));

			const res = await request(app)
				.get('/posts/all')
				.set('Cookie', `token=${token}`);

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('success', true);
			expect(res.body).toHaveProperty('message', 'Posts fetched successfully');
			expect(res.body).toHaveProperty('data');
		});
	});

	describe('GET /userPosts - Fetch User Posts', () => {
		test('should fetch user posts successfully', async () => {
			// Create a test post
			const createRes = await request(app)
				.post('/posts/')
				.set('Cookie', `token=${token}`)
				.send({
					identification_id: 6,
					description: 'User specific post',
					shareLocation: true
				});

			postIdToRemove.push(parseInt(createRes.body.data.id));

			const res = await request(app)
				.get('/posts/userPosts')
				.set('Cookie', `token=${token}`);

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('success', true);
			expect(res.body).toHaveProperty('message', 'User posts fetched successfully');
			expect(res.body).toHaveProperty('data');
		});

		test('should fail without authentication', async () => {
			const res = await request(app)
				.get('/posts/userPosts');

			expect(res.statusCode).toBe(401);
			expect(res.body).toHaveProperty('message', 'You must be logged in to perform this action');
		});
	});

	describe('GET /:postId - Fetch Specific Post', () => {
		test('should fetch specific post successfully', async () => {
			// Create a test post
			const createRes = await request(app)
				.post('/posts/')
				.set('Cookie', `token=${token}`)
				.send({
					identification_id: 6,
					description: 'Specific post for fetching',
					shareLocation: false
				});

			postIdToRemove.push(parseInt(createRes.body.data.id));

			const postId = createRes.body.data.id;

			const res = await request(app)
				.get(`/posts/${postId}`)
				.set('Cookie', `token=${token}`);

			expect(res.statusCode).toBe(201);
			expect(res.body).toHaveProperty('success', true);
			expect(res.body).toHaveProperty('message', 'Post fetched successfully');
			expect(res.body.data).toHaveProperty('post');
			expect(res.body.data).toHaveProperty('comments');
		});

		test('should return 400 for non-existent post', async () => {
			const res = await request(app)
				.get('/posts/99999')
				.set('Cookie', `token=${token}`);

			expect(res.statusCode).toBe(400);
			console.log(res.body);
			expect(res.body).toHaveProperty('message', 'Failed to fetch post');
		});
	});

	describe('POST /:postId/like - Like Post', () => {
		test('should like post successfully', async () => {
			// Create a test post
			const createRes = await request(app)
				.post('/posts/')
				.set('Cookie', `token=${token}`)
				.send({
					identification_id: 6,
					description: 'Post to be liked',
					shareLocation: true
				});

			postIdToRemove.push(parseInt(createRes.body.data.id));

			const postId = createRes.body.data.id;

			const res = await request(app)
				.post(`/posts/${postId}/like`)
				.set('Cookie', `token=${token}`);

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('success', true);
			expect(res.body).toHaveProperty('message', 'Post liked successfully');
		});

		test('should fail without authentication', async () => {
			const res = await request(app)
				.post('/posts/1/like');

			expect(res.statusCode).toBe(401);
			expect(res.body).toHaveProperty('message', 'You must be logged in to perform this action');
		});
	});

	describe('POST /:postId/comment - Add Comment', () => {
		test('should add comment successfully', async () => {
			// Create a test post
			const createRes = await request(app)
				.post('/posts/')
				.set('Cookie', `token=${token}`)
				.send({
					identification_id: 6,
					description: 'Post to be commented on',
					shareLocation: false
				});

			postIdToRemove.push(parseInt(createRes.body.data.id));

			const postId = createRes.body.data.id;

			const res = await request(app)
				.post(`/posts/${postId}/comment`)
				.set('Cookie', `token=${token}`)
				.send({ comment: 'Amazing wildlife photo!' });

			expect(res.statusCode).toBe(201);
			expect(res.body).toHaveProperty('success', true);
			expect(res.body).toHaveProperty('message', 'Comment added to post successfully');
		});

		test('should fail without authentication', async () => {
			const res = await request(app)
				.post('/posts/1/comment')
				.send({ comment: 'Unauthorized comment' });

			expect(res.statusCode).toBe(401);
			expect(res.body).toHaveProperty('message', 'You must be logged in to perform this action');
		});
	});

	describe('Full Integration Flow', () => {
		test('should complete entire post interaction flow', async () => {
			// 1. Create post
			const createRes = await request(app)
				.post('/posts/')
				.set('Cookie', `token=${token}`)
				.send({
					identification_id: 6,
					description: 'Complete flow test post',
					shareLocation: true
				});

			postIdToRemove.push(parseInt(createRes.body.data.id));

			expect(createRes.statusCode).toBe(201);
			const postId = createRes.body.data.id;

			// 2. Like the post
			const likeRes = await request(app)
				.post(`/posts/${postId}/like`)
				.set('Cookie', `token=${token}`);

			expect(likeRes.statusCode).toBe(200);

			// 3. Add comment
			const commentRes = await request(app)
				.post(`/posts/${postId}/comment`)
				.set('Cookie', `token=${token}`)
				.send({ comment: 'Great sighting!' });

			expect(commentRes.statusCode).toBe(201);

			// 4. Verify post with comment
			const fetchRes = await request(app)
				.get(`/posts/${postId}`)
				.set('Cookie', `token=${token}`);

			expect(fetchRes.statusCode).toBe(201);
			expect(fetchRes.body.data.comments).toHaveLength(1);
			expect(fetchRes.body.data.comments[0]).toHaveProperty('comment_text');

			// 5. Verify user posts
			const userPostsRes = await request(app)
				.get('/posts/userPosts')
				.set('Cookie', `token=${token}`);

			expect(userPostsRes.statusCode).toBe(200);
			expect(userPostsRes.body).toHaveProperty('data');
		});
	});
});