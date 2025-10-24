import { API_BASE } from "./api";

export type Movie = {
  id: string;
  title: string;
  year?: number;
  posterUrl?: string;
  overview?: string;
  rating?: number;
  raw?: unknown;
  videoUrl?: string;
};

/**
 * Fetch available movies from backend.
 * GET /movies/tmdb
 * @returns Promise resolving to an array of Movie objects
 */
export async function getMovies(): Promise<Movie[]> {
  const r = await fetch(`${API_BASE}/movies/tmdb`);
  if (!r.ok) throw new Error("Failed to fetch movies");
  const data = await r.json();
  const sampleVideos = [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  ];
  return (Array.isArray(data) ? data : []).map((item: any, index: number) => ({
    id: String(item.id),
    title: item.title || item.name || "Untitled",
    year: item.release_date ? Number(item.release_date.slice(0, 4)) : undefined,
    posterUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : undefined,
    overview: item.overview,
    rating: item.vote_average,
    videoUrl: sampleVideos[index % sampleVideos.length],
    raw: item,
  }));
}
