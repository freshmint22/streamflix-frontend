import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { isTokenBlacklisted } from '../lib/tokenBlacklist';
import User from '../models/Users';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
	const auth = req.headers.authorization || '';
	const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
	if (!token) return res.status(401).json({ error: 'Unauthorized' });
	if (isTokenBlacklisted(token)) return res.status(401).json({ error: 'Token revoked' });
	try {
		const payload = jwt.verify(token, JWT_SECRET) as any;
		(req as any).userId = payload?.sub || payload?.id;
		return next();
	} catch (err) {
		return res.status(401).json({ error: 'Unauthorized' });
	}
}

export default requireAuth;

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
	try {
		const userId = (req as any).userId as string | undefined;
		if (!userId) return res.status(401).json({ error: 'Unauthorized' });
		const user = await User.findById(userId).exec();
		if (!user) return res.status(401).json({ error: 'Unauthorized' });
		if ((user as any).role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
		return next();
	} catch (err) {
		return res.status(500).json({ error: 'Internal server error' });
	}
}

