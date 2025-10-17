import { Router } from 'express';
import { updateUser, deleteUser } from '../controllers/user.controller';
import authMiddleware from '../middleware/auth';

const router = Router();

// Editar usuario
router.put('/:id', authMiddleware, updateUser);

// Eliminar usuario
router.delete('/:id', authMiddleware, deleteUser);

export default router;