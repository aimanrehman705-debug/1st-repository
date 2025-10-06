import { Router } from 'express';
import { loginInfo, me, register } from '../controllers/authController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.get('/login-info', loginInfo);
router.get('/me', requireAuth, me);

export default router;
