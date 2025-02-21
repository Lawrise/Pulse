import { Router } from 'express';
import { login, register, getProfile } from '../controllers/userController';
import authMiddleware from '../middleware/authMiddleware';
import { get } from 'http';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);

export default router;