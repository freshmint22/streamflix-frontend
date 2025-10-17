import { Router } from 'express';
import { getMe, updateMe, deleteMe } from '../controllers/user.controller';
import { validateBody, userUpdateSchema } from '../middleware/validation';
import requireAuth from '../middleware/auth';

const router = Router();

// Protect profile routes with authentication
router.get('/me', requireAuth, getMe);
router.put('/me', requireAuth, validateBody(userUpdateSchema), updateMe);
router.delete('/me', requireAuth, deleteMe);

export default router;
