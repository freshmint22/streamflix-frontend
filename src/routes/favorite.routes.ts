import { Router } from 'express';
import { addFavorite, removeFavorite, listMyFavorites } from '../controllers/favorite.controller';
import { requireAuth } from '../middleware/auth';
import { validateBody, favoriteSchema } from '../middleware/validation';

const router = Router();

// Lista de mis favoritos
router.get('/', requireAuth, listMyFavorites);

// Agregar a favoritos
router.post('/', requireAuth, validateBody(favoriteSchema), addFavorite);

// Quitar de favoritos
router.delete('/:movieId', requireAuth, removeFavorite);

export default router;
