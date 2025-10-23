import { Request, Response } from 'express';
import Favorite from '../models/Favorite';

/**
 * Create a new favorite for the authenticated user.
 *
 * POST /api/favorites
 * @param req Express Request (authenticated - userId populated by middleware)
 * @param res Express Response
 * @returns 201 with created favorite or error status
 */
export async function createFavorite(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { movieId, note } = req.body || {};
    if (!movieId) return res.status(400).json({ error: 'movieId required' });
    const fav = new Favorite({ userId, movieId, note });
    await fav.save();
    return res.status(201).json(fav);
  } catch (err: any) { console.error(err); return res.status(500).json({ error: 'Internal server error' }) }
}

/**
 * List favorites for the authenticated user.
 * GET /api/favorites
 */
/**
 * List favorites for the authenticated user.
 *
 * GET /api/favorites
 * @param req Express Request (authenticated - userId populated by middleware)
 * @param res Express Response
 */
export async function listFavorites(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const items = await Favorite.find({ userId }).populate('movieId').sort({ createdAt: -1 }).exec();
    return res.json(items);
  } catch (err: any) { console.error(err); return res.status(500).json({ error: 'Internal server error' }) }
}

/**
 * Get a single favorite by id for the authenticated user.
 * GET /api/favorites/:id
 */
/**
 * Get a single favorite by id for the authenticated user.
 *
 * GET /api/favorites/:id
 */
export async function getFavorite(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const id = req.params.id;
    const f = await Favorite.findOne({ _id: id, userId }).populate('movieId').exec();
    if (!f) return res.status(404).json({ error: 'Not found' });
    return res.json(f);
  } catch (err: any) { console.error(err); return res.status(500).json({ error: 'Internal server error' }) }
}

/**
 * Update a favorite's note.
 * PUT /api/favorites/:id
 */
/**
 * Update a favorite's note for the authenticated user.
 *
 * PUT /api/favorites/:id
 */
export async function updateFavorite(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const id = req.params.id;
    const { note } = req.body || {};
    const f = await Favorite.findOneAndUpdate({ _id: id, userId }, { note }, { new: true }).exec();
    if (!f) return res.status(404).json({ error: 'Not found' });
    return res.json(f);
  } catch (err: any) { console.error(err); return res.status(500).json({ error: 'Internal server error' }) }
}

/**
 * Delete a favorite.
 * DELETE /api/favorites/:id
 */
/**
 * Delete a favorite belonging to the authenticated user.
 *
 * DELETE /api/favorites/:id
 */
export async function deleteFavorite(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const id = req.params.id;
    await Favorite.findOneAndDelete({ _id: id, userId }).exec();
    return res.json({ message: 'Deleted' });
  } catch (err: any) { console.error(err); return res.status(500).json({ error: 'Internal server error' }) }
}

/**
 * Favorites controller exports
 */
export default { createFavorite, listFavorites, getFavorite, updateFavorite, deleteFavorite };
