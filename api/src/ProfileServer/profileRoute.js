import express from 'express';
import multer from 'multer';
import { profileController } from './profileController.js';

const profileApp = express.Router();
// profileApp.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

profileApp.post('/preferences', express.json(), profileController.updateUserPreferences);
profileApp.get('/preferences', express.json(), profileController.fetchUserPreferences);
profileApp.get('/profile', express.json(), profileController.fetchProfile);
profileApp.post('/profile', upload.single('profileImage'), profileController.updateProfile);

export default profileApp;
