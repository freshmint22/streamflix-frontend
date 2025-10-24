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
    "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
    "https://storage.googleapis.com/coverr-main/mp4/Northern_Lights.mp4",
    "https://storage.googleapis.com/coverr-main/mp4/Footvolley.mp4",
    "https://storage.googleapis.com/coverr-main/mp4/La_Pedrera.mp4",
  ];
  return (Array.isArray(data) ? data : []).map((item: any) => ({
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
