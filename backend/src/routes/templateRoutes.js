import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';
import { listTemplates, createTemplate, updateTemplate, deleteTemplate } from '../controllers/templateController.js';

const router = Router();

router.use(requireAuth);
router.get('/', listTemplates); // users can view

router.use(requireAdmin);
router.post('/', createTemplate);
router.put('/:id', updateTemplate);
router.delete('/:id', deleteTemplate);

export default router;
