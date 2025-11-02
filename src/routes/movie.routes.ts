import { Router } from 'express';
import {
  listMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../controllers/movie.controller';
import { getPopularMovies } from '../services/tmdb.service';
import { validateBody, movieSchema } from '../middleware/validation';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

// Public listing and detail
router.get('/', listMovies);
router.get('/tmdb', async (_req, res) => {
  try {
    const movies = await getPopularMovies();
    res.json(movies);
  } catch (error: any) {
    res.status(500).json({ error: 'Error fetching TMDB movies', details: error?.message || String(error) });
  }
});
router.get('/:id', getMovie);

// Admin-like actions (protected)
router.post('/', requireAuth, requireAdmin, validateBody(movieSchema), createMovie);
router.put('/:id', requireAuth, requireAdmin, validateBody(movieSchema), updateMovie);
router.delete('/:id', requireAuth, requireAdmin, deleteMovie);

export default router;
