import express from 'express';
import { discoveryController } from './discoveryController.js';

const discoveryApp = express();
discoveryApp.use(express.json());

discoveryApp.get('/bestiary', discoveryController.getAllAnimals);

discoveryApp.get('/sightings', discoveryController.getMapSightings);

export default discoveryApp;
