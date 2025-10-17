import { Router } from 'express';
import { register, login, logout, forgotPassword, resetPassword } from '../controllers/auth.controller';

const router = Router();

// POST /auth/register
router.post('/register', register);

// POST /auth/login
router.post('/login', login);

// DELETE /auth/logout
router.delete('/logout', logout);

// POST /auth/forgot-password
router.post('/forgot-password', forgotPassword);

// POST /auth/reset-password
router.post('/reset-password', resetPassword);

export default router;
