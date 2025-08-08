import express from 'express';
import { postingController } from './postingController.js';

const postingApp = express();
postingApp.use(express.json());

//new post endpoint
postingApp.post('/', postingController.createPost);
//view post endpoint
postingApp.get('/:postId', postingController.fetchPost);
//fetch all posts endpoint
postingApp.get('/all', postingController.fetchAllPosts);
//like post endpoint
postingApp.patch('/:postId/like', postingController.likePost);
//add comment endpoint
postingApp.post('/:postId/comment', postingController.addComment);

export default postingApp;
