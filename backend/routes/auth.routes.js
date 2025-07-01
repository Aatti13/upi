import Router from 'express';

import { signup, login, logout } from '../controllers/auth.controller.js';

import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', authenticateToken, logout);

export default router;
