import { Router } from 'express';
import { requireAdmin, requireAuth } from '../middlewares/authMiddleware.js';
import { createTemplate, deleteTemplate, listTemplates, updateTemplate } from '../controllers/templateController.js';

const router = Router();

router.use(requireAuth);
router.get('/', listTemplates);
router.use(requireAdmin);
router.post('/', createTemplate);
router.put('/:id', updateTemplate);
router.delete('/:id', deleteTemplate);

export default router;
