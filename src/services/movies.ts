import { API_BASE } from "./api";
export type Movie = { id: string; title: string; year?: number; posterUrl?: string };

export async function getMovies(): Promise<Movie[]> {
  const r = await fetch(`${API_BASE}/api/movies`);
  if (!r.ok) throw new Error("Failed to fetch movies");
  return r.json();
}
