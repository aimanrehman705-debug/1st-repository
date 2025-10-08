import { Router } from 'express';
import { listUsers, getUser, updateUser, deleteUser, createUser } from '../controllers/userController.js';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/', listUsers);
router.post('/', createUser);
router.get('/:uid', getUser);
router.put('/:uid', updateUser);
router.delete('/:uid', deleteUser);

export default router;
