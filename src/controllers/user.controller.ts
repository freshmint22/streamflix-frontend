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
    const { firstName, lastName, age, email, password, avatar } = req.body || {};
    const updates: any = {};
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (age !== undefined) updates.age = age;
    if (email !== undefined) updates.email = email.toLowerCase().trim();
    if (avatar !== undefined) updates.avatar = avatar;

    // If password change requested, load user and set password to trigger pre-save hash
    if (password) {
      const userObj = await User.findById(userId).exec();
      if (!userObj) return res.status(404).json({ error: 'User not found' });
      if (updates.firstName !== undefined) userObj.firstName = updates.firstName;
      if (updates.lastName !== undefined) userObj.lastName = updates.lastName;
      if (updates.age !== undefined) userObj.age = updates.age;
      if (updates.email !== undefined) userObj.email = updates.email;
      if (updates.avatar !== undefined) userObj.avatar = updates.avatar;
      userObj.password = password;
      await userObj.save();
      const u = userObj.toObject(); delete (u as any).password;
      return res.json(u);
    }

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
