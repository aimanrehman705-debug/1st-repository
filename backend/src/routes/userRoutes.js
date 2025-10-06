import { Router } from 'express';
import { requireAdmin, requireAuth } from '../middlewares/authMiddleware.js';
import { deleteUser, getUser, listUsers, updateUser } from '../controllers/userController.js';

const router = Router();

router.use(requireAuth, requireAdmin);
router.get('/', listUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
