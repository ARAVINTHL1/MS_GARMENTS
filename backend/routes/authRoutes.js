import express from 'express';
import { login, signup, employeeSignup, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/employee-signup', employeeSignup);
router.get('/profile', protect, getProfile);

export default router;
