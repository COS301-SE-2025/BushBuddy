import express from 'express';
import { discoveryController } from './discoveryController.js';
import multer from 'multer';

const discoveryApp = express();
discoveryApp.use(express.json());
const uplaod = multer({ storage: multer.memoryStorage() });

discoveryApp.get('/bestiary', discoveryController.getAllAnimals);

discoveryApp.post('/bestiary', uplaod.single('file'), discoveryController.insertNewAnimal);

discoveryApp.get('/sightings', discoveryController.getMapSightings);

export default discoveryApp;
