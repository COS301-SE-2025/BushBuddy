import express from 'express';
import { discoveryController } from './discoveryController.js';

const discoveryApp = express();
discoveryApp.use(express.json());

// GET /api/bestiary - Get all animals
discoveryApp.get('/all', discoveryController.getAllAnimals);

export default discoveryApp;
