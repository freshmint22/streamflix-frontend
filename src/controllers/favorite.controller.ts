import { Request, Response } from 'express';
import Favorite from '../models/Favorite';
import mongoose from 'mongoose';

// Helper para extraer el userId puesto por requireAuth
function getUserId(req: Request){ return (req as any).userId as string | undefined }

// POST /api/favorites  { movieId }
export async function addFavorite(req: Request, res: Response){
  try{
    const userId = getUserId(req);
    if(!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { movieId } = req.body;
    await Favorite.create({ userId: new mongoose.Types.ObjectId(userId), movieId });
    return res.status(201).json({ message: 'Added to favorites' });
  }catch(err: any){
    // Duplicado (ya existe)
    if (err?.code === 11000) return res.status(200).json({ message: 'Already in favorites' });
    console.error('addFavorite', err?.message || err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// DELETE /api/favorites/:movieId
export async function removeFavorite(req: Request, res: Response){
  try{
    const userId = getUserId(req);
    if(!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { movieId } = req.params;
    await Favorite.findOneAndDelete({ userId, movieId }).exec();
    return res.json({ message: 'Removed from favorites' });
  }catch(err:any){
    console.error('removeFavorite', err?.message || err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/favorites  -> lista de movies fav del usuario (solo ids por simplicidad)
export async function listMyFavorites(req: Request, res: Response){
  try{
    const userId = getUserId(req);
    if(!userId) return res.status(401).json({ error: 'Unauthorized' });

    const docs = await Favorite.find({ userId }).select('movieId -_id').lean().exec();
    const movieIds = docs.map(d => d.movieId);
    return res.json({ movieIds, count: movieIds.length });
  }catch(err:any){
    console.error('listMyFavorites', err?.message || err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
