import { Router } from 'express';
import { getSubtitlesByMovie, upsertSubtitle, deleteSubtitle } from '../controllers/subtitle.controller';
import { requireAuth } from '../middleware/auth';
import { validateBody /* , validateParams */ } from '../middleware/validation';
import { subtitleUpsertSchema /* , subtitleDeleteParamsSchema */ } from '../middleware/validation';

const router = Router();

/**
 * Public: fetch available subtitle URLs for a movie
 * GET /api/subtitles/:movieId
 */
router.get('/:movieId', getSubtitlesByMovie);

/**
 * Protected: create or update a subtitle URL (es/en)
 * POST /api/subtitles
 */
router.post('/', requireAuth, validateBody(subtitleUpsertSchema), upsertSubtitle);

/**
 * Protected: delete a subtitle for movie+language
 * DELETE /api/subtitles/:movieId/:language
 */
router.delete('/:movieId/:language', requireAuth, /* validateParams(subtitleDeleteParamsSchema), */ deleteSubtitle);

export default router;
