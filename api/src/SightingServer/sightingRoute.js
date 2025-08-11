import express from 'express';
import multer from 'multer';

import { sightingController } from './sightingController.js';

const sightingsApp = express();
const upload = multer({ storage: multer.memoryStorage() });

// upload endpoint
sightingsApp.post('/', upload.single('file'), sightingController.createSighting);
// fetch endpoint
sightingsApp.get('/:id', express.json(), sightingController.viewSighting);
//history endpoint
sightingsApp.get('/history', express.json(), sightingController.viewHistory);

export default sightingsApp;
