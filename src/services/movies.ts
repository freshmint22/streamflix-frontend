import { API_BASE } from "./api";
export type Movie = { id: string; title: string; year?: number; posterUrl?: string };

/**
 * Fetch available movies from backend.
 * GET /api/movies
 * @returns Promise resolving to an array of Movie objects
 */
export async function getMovies(): Promise<Movie[]> {
  const r = await fetch(`${API_BASE}/api/movies`);
  if (!r.ok) throw new Error("Failed to fetch movies");
  return r.json();
}
