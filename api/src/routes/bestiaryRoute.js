import express from 'express';
import { bestiaryController } from '../controllers/bestiaryController.js';

const bestiaryApp = express();
bestiaryApp.use(express.json());

// GET /api/bestiary - Get all animals
bestiaryApp.get('/all', bestiaryController.getAllAnimals);

export default bestiaryApp;
