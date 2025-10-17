import { Router } from 'express';
import { getMe, updateMe, deleteMe } from '../controllers/user.controller';

const router = Router();

router.get('/me', getMe);
router.put('/me', updateMe);
router.delete('/me', deleteMe);

export default router;
