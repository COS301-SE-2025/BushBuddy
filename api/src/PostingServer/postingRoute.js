import express from 'express';
import { postingController } from './postingController.js';
import cookieParser from 'cookie-parser';

const postingApp = express.Router();
postingApp.use(express.json());
// postingApp.use(cookieParser());

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API for managing posts, likes and comments
 */

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identification_id
 *               - description
 *             properties:
 *               identification_id:
 *                 type: string
 *                 example: "animal-123"
 *               description:
 *                 type: string
 *                 example: "I found a stray dog near the park"
 *               shareLocation:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Post created successfully
 *          content:
 *           application/json:
 *             example:
 *              {
 *                "success": true,
 *                "message": "Post created successfully",
 *                "data": {
 *                    "id": "10"
 *                }
 *             }
 *       400:
 *         description: Failed to create post
 *       401:
 *         description: Unauthorized (login required)
 *       500:
 *         description: Internal server error
 */
postingApp.post('/', postingController.createPost);

/**
 * @swagger
 * /all:
 *   get:
 *     summary: Fetch all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of posts fetched successfully
 *          content:
 *           application/json:
 *             example:
 *               {
 *                 "success": true,
 *                 "message": "User posts fetched successfully",
 *                 "data": [
 *                     {
 *                         "id": "9",
 *                         "user_id": "example",
 *                         "identification_id": null,
 *                         "image_url": "https://bushbuddy-images.66767a1d9c....",
 *                         "description": "Beautiful herd of eland antelope spotted during sunset. They were so graceful moving across the grassland.",
 *                         "share_location": false,
 *                         "is_removed": false,
 *                         "created_at": "16 August 2025 19:09",
 *                         "likes": 0
 *                     },
 *                     {
 *                         "id": "8",
 *                         "user_id": "example",
 *                         "identification_id": null,
 *                         "image_url": "https://bushbuddy-images.66767a1d9c...",
 *                         "description": "Two magnificent white rhinos grazing peacefully in the early morning light. Such incredible creatures!",
 *                         "share_location": false,
 *                         "is_removed": false,
 *                         "created_at": "16 August 2025 19:08",
 *                         "likes": 0
 *                     }
 *                 ]
 *              }
 *       204:
 *         description: No posts found
 *       400:
 *         description: Failed to fetch posts
 *       500:
 *         description: Internal server error
 */
postingApp.get('/all/:filter', postingController.fetchAllPosts);

/**
 * @swagger
 * /userPosts:
 *   get:
 *     summary: Fetch all posts created by the logged-in user
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User posts fetched successfully
 *          content:
 *           application/json:
 *             example:
 *               {
 *                 "success": true,
 *                 "message": "User posts fetched successfully",
 *                 "data": [
 *                     {
 *                         "id": "9",
 *                         "user_id": "example",
 *                         "identification_id": null,
 *                         "image_url": "https://bushbuddy-images.66767a1d9c....",
 *                         "description": "Beautiful herd of eland antelope spotted during sunset. They were so graceful moving across the grassland.",
 *                         "share_location": false,
 *                         "is_removed": false,
 *                         "created_at": "16 August 2025 19:09",
 *                         "likes": 0
 *                     },
 *                     {
 *                         "id": "8",
 *                         "user_id": "example",
 *                         "identification_id": null,
 *                         "image_url": "https://bushbuddy-images.66767a1d9c...",
 *                         "description": "Two magnificent white rhinos grazing peacefully in the early morning light. Such incredible creatures!",
 *                         "share_location": false,
 *                         "is_removed": false,
 *                         "created_at": "16 August 2025 19:08",
 *                         "likes": 0
 *                     }
 *                 ]
 *              }
 *       204:
 *         description: User has no posts
 *       400:
 *         description: Failed to fetch user posts
 *       401:
 *         description: Unauthorized (login required)
 *       500:
 *         description: Internal server error
 */
postingApp.get('/userPosts', postingController.fetchAllUserPosts);

/**
 * @swagger
 * /{postId}:
 *   get:
 *     summary: Fetch a specific post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: Post fetched successfully
 *          content:
 *           application/json:
 *             example:
 *               {
 *                 "success": true,
 *                 "message": "Post fetched successfully",
 *                 "data": {
 *                     "post": {
 *                         "id": "6",
 *                         "user_id": "example",
 *                         "identification_id": null,
 *                         "image_url": "https://bushbuddy-images.66767a1d9c75a1f1bee948cd3cf55672.r2.cloudflarestorage.com/Plgv0_6BV1HH?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ac3de1d38e6f6ad923d528a5caed6c4c%2F20250817%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250817T201127Z&X-Amz-Expires=86400&X-Amz-Signature=9780b0792b2c820ec39e911bfad5f9e3f8cc7cd56fd4d2609e11d3395fe09074&X-Amz-SignedHeaders=host&response-cache-control=public%2C%20max-age%3D604800&x-amz-checksum-mode=ENABLED&x-id=GetObject",
 *                         "description": "I spotted this large Elephant bull near Bateleur road this morning while on a game drive",
 *                         "share_location": false,
 *                         "is_removed": false,
 *                         "created_at": "16 August 2025 19:07",
 *                         "likes": 0
 *                     },
 *                     "comments": [
 *                         {
 *                             "id": 2,
 *                             "user_id": "example",
 *                             "post_id": "6",
 *                             "comment_text": "Love this so much!",
 *                             "created_at": "2025-08-16T18:56:19.885Z"
 *                         }
 *                     ]
 *                 }
 *             }
 *       204:
 *         description: No post found
 *       400:
 *         description: Post ID missing or invalid
 *       500:
 *         description: Internal server error
 */
postingApp.get('/:postId', postingController.fetchPost);

/**
 * @swagger
 * /{postId}/like:
 *   post:
 *     summary: Like a post
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: Post liked successfully
 *       400:
 *         description: Failed to like post
 *       401:
 *         description: Unauthorized (login required)
 *       500:
 *         description: Internal server error
 */
postingApp.post('/:postId/like', postingController.likePost);

/**
 * @swagger
 * /{postId}/comment:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *             properties:
 *               comment:
 *                 type: string
 *                 example: "This is so cute!"
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Failed to add comment
 *       401:
 *         description: Unauthorized (login required)
 *       500:
 *         description: Internal server error
 */
postingApp.post('/:postId/comment', postingController.addComment);

export default postingApp;
