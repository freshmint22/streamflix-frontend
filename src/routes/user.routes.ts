import { Router } from 'express';
import { getMe, updateMe, deleteMe } from '../controllers/user.controller';
import { validateBody, userUpdateSchema } from '../middleware/validation';

const router = Router();

router.get('/me', getMe);
router.put('/me', validateBody(userUpdateSchema), updateMe);
router.delete('/me', deleteMe);

export default router;
