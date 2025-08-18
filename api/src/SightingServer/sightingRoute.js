import express from 'express';
import multer from 'multer';

import { sightingController } from './sightingController.js';

const sightingsApp = express();
const upload = multer({ storage: multer.memoryStorage() });

// history endpoint
sightingsApp.get('/history', sightingController.viewHistory);

// fetch endpoint
// Updated the parameter name from ':id' to ':sightingId' for consistency.
sightingsApp.get('/:sightingId', sightingController.viewSighting);

// upload endpoint
sightingsApp.post('/', upload.single('file'), sightingController.createSighting);

export default sightingsApp;