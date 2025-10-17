import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/Users';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

export async function register(req: Request, res: Response) {
  try {
    const { firstName, lastName, email, password } = (req.body || {}) as {
      firstName?: string;
      lastName?: string;
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

    const user = new User({ email: email.toLowerCase().trim(), password, name });
    await user.save();

    const token = jwt.sign({ sub: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    const userSafe = {
      _id: user._id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      createdAt: user.createdAt
    };

    return res.status(201).json({ token, user: userSafe });
  } catch (err: any) {
    console.error('Register error:', err?.message || err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default { register };
//“Controllers para Sprint 2”