import { Router } from 'express';
import { upsertRating, getMyRatingForMovie, deleteMyRatingForMovie, getRatingStatsForMovie } from '../controllers/rating.controller';
import { requireAuth } from '../middleware/auth';
import { validateBody, ratingSchema } from '../middleware/validation';

const router = Router();

// Crear/actualizar mi calificación
router.post('/', requireAuth, validateBody(ratingSchema), upsertRating);

// Obtener / eliminar mi calificación para una película
router.get('/me/:movieId', requireAuth, getMyRatingForMovie);
router.delete('/me/:movieId', requireAuth, deleteMyRatingForMovie);

// Estadísticas por película 
router.get('/stats/:movieId', getRatingStatsForMovie);

export default router;
