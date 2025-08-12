import express from 'express';
import multer from 'multer';

import { sightingController } from './sightingController.js';

const sightingsApp = express();
const upload = multer({ storage: multer.memoryStorage() });

// === Corrected Route Order ===
// Define the more specific '/history' route before the general '/:sightingId' route.
// This prevents 'history' from being incorrectly interpreted as a sighting ID.

// history endpoint
sightingsApp.get('/history', sightingController.viewHistory);

// fetch endpoint
// We've updated the parameter name from ':id' to ':sightingId' for consistency.
sightingsApp.get('/:sightingId', sightingController.viewSighting);

// upload endpoint
sightingsApp.post('/', upload.single('file'), sightingController.createSighting);

export default sightingsApp;