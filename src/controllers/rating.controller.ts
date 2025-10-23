import { Request, Response } from 'express';
import Rating from '../models/Rating';
import mongoose from 'mongoose';

function getUserId(req: Request){ return (req as any).userId as string | undefined }

// POST /api/ratings  { movieId, rating }
export async function upsertRating(req: Request, res: Response){
  try{
    const userId = getUserId(req);
    if(!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { movieId, rating } = req.body;
    const filter = { userId: new mongoose.Types.ObjectId(userId), movieId };
    const update = { $set: { rating } };
    const opts = { upsert: true, new: true };
    const doc = await Rating.findOneAndUpdate(filter, update, opts).exec();
    return res.status(200).json({ message: 'Rating saved', item: doc });
  }catch(err:any){
    console.error('upsertRating', err?.message || err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/ratings/me/:movieId  -> rating del usuario (si existe)
export async function getMyRatingForMovie(req: Request, res: Response){
  try{
    const userId = getUserId(req);
    if(!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { movieId } = req.params;
    const doc = await Rating.findOne({ userId, movieId }).lean().exec();
    return res.json({ rating: doc?.rating ?? null });
  }catch(err:any){
    console.error('getMyRatingForMovie', err?.message || err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// DELETE /api/ratings/me/:movieId
export async function deleteMyRatingForMovie(req: Request, res: Response){
  try{
    const userId = getUserId(req);
    if(!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { movieId } = req.params;
    await Rating.findOneAndDelete({ userId, movieId }).exec();
    return res.json({ message: 'Rating removed' });
  }catch(err:any){
    console.error('deleteMyRatingForMovie', err?.message || err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/ratings/stats/:movieId  -> promedio y conteo
export async function getRatingStatsForMovie(req: Request, res: Response){
  try{
    const { movieId } = req.params;
    const agg = await Rating.aggregate([
      { $match: { movieId: new mongoose.Types.ObjectId(movieId) } },
      { $group: { _id: '$movieId', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    const stats = agg[0] ? { average: agg[0].avg, count: agg[0].count } : { average: null, count: 0 };
    return res.json(stats);
  }catch(err:any){
    console.error('getRatingStatsForMovie', err?.message || err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
