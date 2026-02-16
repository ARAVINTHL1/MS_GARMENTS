import express from 'express';
import { login, signup, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/profile', protect, getProfile);

export default router;
