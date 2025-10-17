import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/Users';
import crypto from 'crypto';
import { addTokenToBlacklist } from '../lib/tokenBlacklist';
import { forgotPassword as forgotPasswordWithEmail, resetPassword as resetPasswordWithEmail } from './passwordController';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

/**
 * Register a new user and return a JWT token and user profile.
 *
 * POST /auth/register
 * Body: { firstName, lastName?, age?, email, password }
 *
 * Responses:
 *  - 201: { token, user }
 *  - 400: validation error
 *  - 409: email already in use
 */
export async function register(req: Request, res: Response) {
  try {
    const { firstName, lastName, age, email, password } = (req.body || {}) as {
      firstName?: string;
      lastName?: string;
      age?: number;
      email?: string;
      password?: string;
    };

    if (!firstName || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

  const name = `${firstName}${lastName ? ' ' + lastName : ''}`.trim();

    // Check duplicate email
    const existing = await User.findOne({ email: email.toLowerCase().trim() }).exec();
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    const user = new User({
      email: email.toLowerCase().trim(),
      password,
      name,
      firstName,
      lastName,
      age,
    });
    await user.save();

    const token = jwt.sign({ sub: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    const userSafe = {
      _id: user._id,
      email: user.email,
      name: user.name,
      firstName: (user as any).firstName,
      lastName: (user as any).lastName,
      age: (user as any).age,
      avatar: user.avatar,
      createdAt: (user as any).createdAt,
    };

    return res.status(201).json({ token, user: userSafe });
  } catch (err: any) {
    console.error('Register error:', err?.message || err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Authenticate a user and return a JWT token and user profile.
 *
 * POST /auth/login
 * Body: { email, password }
 *
 * Responses:
 *  - 200: { token, user }
 *  - 401: invalid credentials
 */
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = (req.body || {}) as { email?: string; password?: string };
    if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });

    const user = await User.findOne({ email: email.toLowerCase().trim() }).exec();
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isValid = await (user as any).comparePassword(password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ sub: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    const userSafe = {
      _id: user._id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      createdAt: (user as any).createdAt,
    };

    return res.json({ token, user: userSafe });
  } catch (err: any) {
    console.error('Login error:', err?.message || err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Log out the current user by blacklisting the provided JWT.
 *
 * DELETE /auth/logout
 * Authorization: Bearer <token>
 *
 * This adds the token to an in-memory blacklist. In production a persistent
 * store (Redis) is recommended to survive restarts.
 */
export async function logout(req: Request, res: Response) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!token) return res.status(400).json({ error: 'No token provided' });
    addTokenToBlacklist(token);
    return res.json({ message: 'Logged out' });
  } catch (err: any) {
    console.error('Logout error:', err?.message || err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export const forgotPassword = forgotPasswordWithEmail;
export const resetPassword = resetPasswordWithEmail;

export default { register, login, logout, forgotPassword, resetPassword };
