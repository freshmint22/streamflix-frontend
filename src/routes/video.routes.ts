import { Router, Request, Response } from 'express';
import { searchVideos, getVideosFromPexels } from '../services/video.service';

const router = Router();

/**
 * GET /api/videos/search?q=...&perPage=10&page=1
 * Proxies a search request to the Pexels Videos API using the service wrapper.
 */
router.get('/search', async (req: Request, res: Response) => {
  const q = String(req.query.q || req.query.query || 'nature');
  const perPage = Number(req.query.perPage || req.query.per_page || 10);
  const page = Number(req.query.page || 1);
  try {
    const data = await searchVideos(q, perPage, page);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: 'Video search failed', details: err?.message || String(err) });
  }
});

/**
 * GET /api/videos/pexels?query=cinema
 * Returns a simplified array of video objects mapped from the Pexels response.
 */
router.get('/pexels', async (req: Request, res: Response) => {
  const q = String(req.query.q || req.query.query || 'movie');
  const perPage = Number(req.query.perPage || req.query.per_page || 10);
  try {
    const list = await getVideosFromPexels(q, perPage);
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch videos', details: err?.message || String(err) });
  }
});

export default router;
