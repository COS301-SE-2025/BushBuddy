import express from 'express';
import { profileController } from './profileController.js';

const profileApp = express.Router();
profileApp.use(express.json());

profileApp.post('/preferences', profileController.updateUserPreferences);
profileApp.get('/preferences', profileController.fetchUserPreferences);

export default profileApp;
