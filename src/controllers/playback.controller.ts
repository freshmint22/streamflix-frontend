import { Request, Response } from 'express';
import Playback from '../models/Playback';

/**
 * Helper: extract authenticated user id set by requireAuth middleware.
 * @param req Express Request
 */
function getUserId(req: Request){ return (req as any).userId as string }

/**
 * Start or resume playback for a movie for the authenticated user.
 * POST /api/playback/start
 * Body: { movieId, position }
 */
export async function startPlayback(req: Request, res: Response){
  try{
    const userId = getUserId(req);
    const { movieId, position } = req.body || {};
    if (!movieId) return res.status(400).json({ error: 'movieId required' });
    const p = await Playback.findOneAndUpdate({ userId, movieId }, { position: position || 0, state: 'playing' }, { upsert: true, new: true }).exec();
    return res.json(p);
  }catch(err:any){ console.error(err); return res.status(500).json({ error: 'Internal server error' }) }
}

/**
 * Pause playback and save position.
 * POST /api/playback/pause
 */
export async function pausePlayback(req: Request, res: Response){
  try{
    const userId = getUserId(req);
    const { movieId, position } = req.body || {};
    if (!movieId) return res.status(400).json({ error: 'movieId required' });
    const p = await Playback.findOneAndUpdate({ userId, movieId }, { position: position || 0, state: 'paused' }, { upsert: true, new: true }).exec();
    return res.json(p);
  }catch(err:any){ console.error(err); return res.status(500).json({ error: 'Internal server error' }) }
}

/**
 * Stop playback and save final position/state.
 * POST /api/playback/stop
 */
export async function stopPlayback(req: Request, res: Response){
  try{
    const userId = getUserId(req);
    const { movieId, position } = req.body || {};
    if (!movieId) return res.status(400).json({ error: 'movieId required' });
    const p = await Playback.findOneAndUpdate({ userId, movieId }, { position: position || 0, state: 'stopped' }, { upsert: true, new: true }).exec();
    return res.json(p);
  }catch(err:any){ console.error(err); return res.status(500).json({ error: 'Internal server error' }) }
}

/**
 * Get recent playback states for a given user.
 * GET /api/playback/:userId
 */
export async function getPlaybackForUser(req: Request, res: Response){
  try{
    const userId = req.params.userId as string;
    const items = await Playback.find({ userId }).sort({ updatedAt: -1 }).limit(50).exec();
    return res.json(items);
  }catch(err:any){ console.error(err); return res.status(500).json({ error: 'Internal server error' }) }
}

export default { startPlayback, pausePlayback, stopPlayback, getPlaybackForUser };
