import express from 'express';
import { discoveryController } from './discoveryController.js';
import multer from 'multer';

const discoveryApp = express();
const upload = multer({ storage: multer.memoryStorage() });

discoveryApp.get('/bestiary', express.json(), discoveryController.getAllAnimals);

discoveryApp.post('/bestiary', upload.single('file'), discoveryController.insertNewAnimal);

discoveryApp.get('/sightings', express.json(), discoveryController.getMapSightings);

export default discoveryApp;
