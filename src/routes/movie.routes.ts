import { Router } from 'express';
import {
  listMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../controllers/movie.controller';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

// Public listing and detail
router.get('/', listMovies);
router.get('/:id', getMovie);

// Admin-like actions (protected)
router.post('/', requireAuth, requireAdmin, createMovie);
router.put('/:id', requireAuth, requireAdmin, updateMovie);
router.delete('/:id', requireAuth, requireAdmin, deleteMovie);

export default router;
