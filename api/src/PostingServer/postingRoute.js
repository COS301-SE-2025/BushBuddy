import express from 'express';
import { postingController } from './postingController.js';

const postingApp = express();
postingApp.use(express.json());

//new post endpoint
postingApp.post('/', postingController.createPost);
//fetch all posts endpoint
postingApp.get('/all', postingController.fetchAllPosts);
//view post endpoint
postingApp.get('/:postId', postingController.fetchPost);
//fetch all user posts endpoint
postingApp.get('/userPosts', postingController.fetchAllUserPosts);
//like post endpoint
postingApp.post('/:postId/like', postingController.likePost);
//add comment endpoint
postingApp.post('/:postId/comment', postingController.addComment);

export default postingApp;
