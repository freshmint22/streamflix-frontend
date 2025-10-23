import fetch from 'node-fetch';

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

/**
 * Search videos using the Pexels Videos API.
 *
 * This wrapper forwards the query to Pexels and returns the parsed JSON response.
 * It intentionally keeps typing loose because the Pexels response shape is larger
 * than needed for the demo.
 *
 * @param query Search query string
 * @param perPage Results per page (default 10)
 * @param page Page number (default 1)
 * @returns Parsed JSON response from Pexels
 * @throws Error when PEXELS_API_KEY is not configured or when the remote call fails
 */
export async function searchVideos(query: string, perPage = 10, page = 1) {
  if (!PEXELS_API_KEY) throw new Error('PEXELS_API_KEY not configured');
  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`;
  const res = await fetch(url, { headers: { Authorization: PEXELS_API_KEY } });
  if (!res.ok) throw new Error(`Pexels error: ${res.status}`);
  return res.json();
}

/**
 * Convenience mapper: fetches from Pexels and returns a simplified array
 * of video objects suitable for the frontend/demo.
 */
export async function getVideosFromPexels(query: string, perPage = 10) {
  if (!PEXELS_API_KEY) throw new Error('PEXELS_API_KEY not configured');
  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${perPage}`;
  const res = await fetch(url, { headers: { Authorization: PEXELS_API_KEY } });
  if (!res.ok) throw new Error(`Pexels API error: ${res.statusText}`);
  const data = await res.json();
  const list = (data?.videos || []).map((video: any) => ({
    id: video.id,
    url: video.video_files && video.video_files[0] ? video.video_files[0].link : null,
    duration: video.duration,
    image: video.image,
    user: video.user?.name || null,
  }));
  return list;
}

export default { searchVideos };
