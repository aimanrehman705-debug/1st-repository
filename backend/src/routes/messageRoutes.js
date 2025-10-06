import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { sendMessage, scheduleMessage, listMyMessages, adminListAllMessages, dashboardStats, uploadCsvAndSend } from '../controllers/messageController.js';
import { requireAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(requireAuth);

router.get('/me', listMyMessages);
router.post('/send', sendMessage);
router.post('/schedule', scheduleMessage);
router.post('/upload-csv', uploadCsvAndSend);

router.get('/admin/all', requireAdmin, adminListAllMessages);
router.get('/admin/stats', requireAdmin, dashboardStats);

export default router;
