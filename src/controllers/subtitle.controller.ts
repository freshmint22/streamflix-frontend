import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Subtitle from '../models/Subtitle';

/**
 * Get subtitles for a movie (both languages if available).
 * GET /api/subtitles/:movieId
 */
export async function getSubtitlesByMovie(req: Request, res: Response) {
  try {
    const { movieId } = req.params;

    if (!mongoose.isValidObjectId(movieId)) {
      return res.status(400).json({ error: 'Invalid movieId' });
    }

    const subs = await Subtitle.find({ movieId }).lean().exec();
    // Normalize the response as { es: string|null, en: string|null }
    const result: { es: string | null; en: string | null } = { es: null, en: null };
    for (const s of subs) {
      if (s.language === 'es') result.es = s.url;
      if (s.language === 'en') result.en = s.url;
    }
    return res.json(result);
  } catch (err: any) {
    console.error('getSubtitlesByMovie', err?.message || err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Create or update a subtitle for a movie+language.
 * POST /api/subtitles
 * Body: { movieId, language: 'es'|'en', url }
 * Requires auth (and optionally admin if you have roles)
 */
export async function upsertSubtitle(req: Request, res: Response) {
  try {
    const { movieId, language, url } = req.body;

    if (!mongoose.isValidObjectId(movieId)) {
      return res.status(400).json({ error: 'Invalid movieId' });
    }

    const filter = { movieId: new mongoose.Types.ObjectId(movieId), language };
    const update = { $set: { url } };
    const options = { upsert: true, new: true };

    const doc = await Subtitle.findOneAndUpdate(filter, update, options).exec();
    return res.status(200).json({ message: 'Subtitle saved', item: doc });
  } catch (err: any) {
    // Duplicate key would only happen if unique index conflicts (rare with same filter)
    console.error('upsertSubtitle', err?.message || err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Delete a subtitle for a movie+language.
 * DELETE /api/subtitles/:movieId/:language
 * Requires auth (and optionally admin if you have roles)
 */
export async function deleteSubtitle(req: Request, res: Response) {
  try {
    const { movieId, language } = req.params;

    if (!mongoose.isValidObjectId(movieId)) {
      return res.status(400).json({ error: 'Invalid movieId' });
    }
    if (!['es', 'en'].includes(language)) {
      return res.status(400).json({ error: 'Invalid language' });
    }

    await Subtitle.findOneAndDelete({ movieId, language }).exec();
    return res.json({ message: 'Subtitle removed' });
  } catch (err: any) {
    console.error('deleteSubtitle', err?.message || err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
