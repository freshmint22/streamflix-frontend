import { Request, Response } from 'express';
import User from '../models/Users';
import mongoose from 'mongoose';

// Helper to get user id from req (we set it in requireAuth as (req as any).userId)
/**
 * Helper: extract user id set by auth middleware.
 * @param req Express request
 */
function getUserId(req: Request){ return (req as any).userId as string | undefined }

/**
 * Get profile of the current authenticated user.
 * GET /users/me
 */
export async function getMe(req: Request, res: Response){
  try{
    const userId = getUserId(req);
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) return res.status(401).json({ error: 'Unauthorized' });
    const user = await User.findById(userId).select('-password').exec();
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  }catch(err:any){ console.error(err); return res.status(500).json({ error: 'Internal server error' }) }
}

/**
 * Update profile of the current authenticated user.
 * PUT /users/me
 * Body: { name?, email?, avatar? }
 */
export async function updateMe(req: Request, res: Response){
  try{
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { name, email, avatar } = req.body || {};
    const updates: any = {};
    if (name) updates.name = name;
    if (email) updates.email = email.toLowerCase().trim();
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password').exec();
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  }catch(err:any){ console.error(err); return res.status(500).json({ error: 'Internal server error' }) }
}

/**
 * Delete the current authenticated user's account.
 * DELETE /users/me
 */
export async function deleteMe(req: Request, res: Response){
  try{
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    await User.findByIdAndDelete(userId).exec();
    return res.json({ message: 'Account deleted' });
  }catch(err:any){ console.error(err); return res.status(500).json({ error: 'Internal server error' }) }
}

export default { getMe, updateMe, deleteMe };
//“Controllers para Sprint 2”