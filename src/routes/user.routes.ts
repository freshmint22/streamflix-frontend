import { Router } from 'express';
import { getMe, updateMe, deleteMe } from '../controllers/user.controller';
import { validateBody, userUpdateSchema } from '../middleware/validation';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Protect all user routes with authentication
router.use(requireAuth as any);

router.get('/me', getMe);
router.put('/me', validateBody(userUpdateSchema), updateMe);
router.delete('/me', deleteMe);

export default router;
