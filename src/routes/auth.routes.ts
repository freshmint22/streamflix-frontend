import { Router } from 'express';
import { register, login, logout, forgotPassword, resetPassword } from '../controllers/auth.controller';
import { validateBody, registerSchema, loginSchema } from '../middleware/validation';

const router = Router();

// POST /auth/register
router.post('/register', validateBody(registerSchema), register);

// POST /auth/login
router.post('/login', validateBody(loginSchema), login);

// DELETE /auth/logout
router.delete('/logout', logout);

// POST /auth/forgot-password
router.post('/forgot-password', forgotPassword);

// POST /auth/reset-password
router.post('/reset-password', resetPassword);

export default router;
