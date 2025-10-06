import { Router } from 'express';
import { requireAdmin, requireAuth } from '../middlewares/authMiddleware.js';
import { listAllMessages, listMyMessages, scheduleMessage, sendMessage } from '../controllers/messageController.js';

const router = Router();

router.use(requireAuth);
router.post('/send', sendMessage);
router.post('/schedule', scheduleMessage);
router.get('/me', listMyMessages);
router.get('/all', requireAdmin, listAllMessages);

export default router;
