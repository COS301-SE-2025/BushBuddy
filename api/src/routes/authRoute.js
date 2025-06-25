import express from 'express';
import { authController } from '../controllers/authController';

const router = express.Router();

// routes to controllers go here
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

export default router;
