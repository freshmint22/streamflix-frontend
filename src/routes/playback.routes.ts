import { Router } from 'express';
import { startPlayback, pausePlayback, stopPlayback, getPlaybackForUser } from '../controllers/playback.controller';
import { requireAuth } from '../middleware/auth';
import { validateBody, playbackSchema } from '../middleware/validation';

const router = Router();

router.post('/start', requireAuth, validateBody(playbackSchema), startPlayback);
router.post('/pause', requireAuth, validateBody(playbackSchema), pausePlayback);
router.post('/stop', requireAuth, validateBody(playbackSchema), stopPlayback);
router.get('/:userId', requireAuth, getPlaybackForUser);

export default router;
