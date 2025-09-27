import express from 'express';
import multer from 'multer';

import { sightingController } from './sightingController.js';

const sightingsApp = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// upload endpoint
sightingsApp.post('/', upload.single('file'), sightingController.createSighting);
//fetch all Sightings endpoint
sightingsApp.get('/all', express.json(), sightingController.fetchAllSightings);
//fetch amount of sightings by user endpoint
sightingsApp.get('/amount', express.json(), sightingController.fetchUserSightingsAmount);
//achievements endpoint
sightingsApp.get('/achievements', express.json(), sightingController.fetchUserAchievements);
//history endpoint
sightingsApp.get('/history', express.json(), sightingController.viewHistory);
//fetch post with sighting id endpoint
sightingsApp.get('/post/:id', express.json(), sightingController.fetchPost);
// fetch endpoint
sightingsApp.get('/:id', express.json(), sightingController.viewSighting);

export default sightingsApp;
