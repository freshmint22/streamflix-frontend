import { Request, Response } from 'express';
import Movie from '../models/Movie';

/**
 * List movies with optional text search and pagination.
 * GET /api/movies?q=search&page=1&limit=20
 */
export async function listMovies(req: Request, res: Response) {
  try {
    const q = (req.query.q as string) || '';
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 20));
    const filter: any = { isActive: true };
    if (q) filter.$text = { $search: q };

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Movie.find(filter).sort({ releaseYear: -1 }).skip(skip).limit(limit).exec(),
      Movie.countDocuments(filter).exec(),
    ]);

    return res.json({ items, total, page, limit });
  } catch (err: any) {
    console.error('List movies error:', err?.message || err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get a movie by its id.
 * GET /api/movies/:id
 */
export async function getMovie(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const movie = await Movie.findById(id).exec();
    if (!movie) return res.status(404).json({ error: 'Not found' });
    return res.json(movie);
  } catch (err: any) {
    console.error('Get movie error:', err?.message || err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Create a new movie (admin only).
 * POST /api/movies
 */
export async function createMovie(req: Request, res: Response) {
  try {
    const payload = req.body || {};
    const movie = new Movie(payload);
    await movie.save();
    return res.status(201).json(movie);
  } catch (err: any) {
    console.error('Create movie error:', err?.message || err);
    return res.status(400).json({ error: err?.message || 'Bad request' });
  }
}

/**
 * Update an existing movie (admin only).
 * PUT /api/movies/:id
 */
export async function updateMovie(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const updates = req.body || {};
    const movie = await Movie.findByIdAndUpdate(id, updates, { new: true }).exec();
    if (!movie) return res.status(404).json({ error: 'Not found' });
    return res.json(movie);
  } catch (err: any) {
    console.error('Update movie error:', err?.message || err);
    return res.status(400).json({ error: err?.message || 'Bad request' });
  }
}

/**
 * Delete a movie by id (admin only).
 * DELETE /api/movies/:id
 */
export async function deleteMovie(req: Request, res: Response) {
  try {
    const id = req.params.id;
    await Movie.findByIdAndDelete(id).exec();
    return res.json({ message: 'Deleted' });
  } catch (err: any) {
    console.error('Delete movie error:', err?.message || err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default { listMovies, getMovie, createMovie, updateMovie, deleteMovie };
//“Controllers para Sprint 2”