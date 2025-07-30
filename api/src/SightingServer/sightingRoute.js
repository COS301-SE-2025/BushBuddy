import express from 'express';

import { sightingController } from './sightingController';

const sightingsApp = express();
sightingsApp.use(express.json);

// upload endpoint
sightingsApp.put('/', sightingController.createSighting);
// fetch endpoint
sightingsApp.get('/', sightingController.viewSighting);
//history endpoint
sightingsApp.get('/history', sightingController.viewHistory);

export default sightingsApp;
