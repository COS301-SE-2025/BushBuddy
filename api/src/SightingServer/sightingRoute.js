import express from 'express';
import multer from 'multer';

import { sightingController } from './sightingController.js';

const sightingsApp = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// upload endpoint
sightingsApp.post('/', upload.single('file'), sightingController.createSighting);
//fetch all Sightings endpoint
sightingsApp.get('/all', express.json(), sightingController.fetchAllSightings);
//history endpoint
sightingsApp.get('/history', express.json(), sightingController.viewHistory);
// fetch endpoint
sightingsApp.get('/:id', express.json(), sightingController.viewSighting);

export default sightingsApp;
