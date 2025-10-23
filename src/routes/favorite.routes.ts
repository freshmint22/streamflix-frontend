import { Router } from 'express';
import Joi from 'joi';
import { createFavorite, listFavorites, getFavorite, updateFavorite, deleteFavorite } from '../controllers/favorite.controller';
import { requireAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validation';

const router = Router();

router.use(requireAuth as any);

const favoriteCreateSchema = Joi.object({ movieId: Joi.string().required(), note: Joi.string().optional() });
const favoriteUpdateSchema = Joi.object({ note: Joi.string().optional() });

router.post('/', validateBody(favoriteCreateSchema), createFavorite);
router.get('/', listFavorites);
router.get('/:id', getFavorite);
router.put('/:id', validateBody(favoriteUpdateSchema), updateFavorite);
router.delete('/:id', deleteFavorite);

export default router;
