import express from 'express';
import { profileController } from './profileController';

const profileApp = express.Router();
profileApp.use(express.json());

profileApp.post('/preferences', profileController.updateUserPreferences);

export default profileApp;
