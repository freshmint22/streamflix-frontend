import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { id?: string | number } | any;
}

export default function auth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || String(req.user.id) !== String(req.params.id)) {
    return res.status(403).json({ message: 'Not authorized to modify this account' });
  }
  next();
}