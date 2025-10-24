import { API_BASE } from "./api";

/**
 * Favorites client helpers.
 * Provides getFavorites, addFavorite and removeFavorite functions.
 */
export type FavoriteMovie = {
  id: string;
  title?: string;
  posterUrl?: string;
  year?: number;
  videoUrl?: string;
};

export type FavoriteItem = { _id?: string; movieId: string; movie?: FavoriteMovie; note?: string };

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("sf_token") || ""}` });

export async function getFavorites(): Promise<FavoriteItem[]> {
  const res = await fetch(`${API_BASE}/favorites`, { headers: authHeader() });
  if (!res.ok) throw new Error("Failed to fetch favorites");
  return res.json();
}

export async function addFavorite(movie: FavoriteMovie) {
  const res = await fetch(`${API_BASE}/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ movieId: movie.id, movie }),
  });
  if (!res.ok) throw new Error("Failed to add favorite");
  return res.json();
}

/**
 * removeFavorite accepts either a favorite id or a movieId.
 * If the backend only supports deletion by favorite id, the client must map movieId -> favoriteId first.
 */
export async function removeFavorite(idOrMovieId: string) {
  // Try deleting directly by id
  let res = await fetch(`${API_BASE}/favorites/${idOrMovieId}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  if (res.ok) return res.json();

  // If backend didn't accept that id, try to find favorite by movieId and remove
  const list = await getFavorites();
  const f = list.find((x) => x.movieId === idOrMovieId || x._id === idOrMovieId);
  if (!f || !f._id) throw new Error("Favorite not found");
  res = await fetch(`${API_BASE}/favorites/${f._id}`, { method: "DELETE", headers: authHeader() });
  if (!res.ok) throw new Error("Failed to remove favorite");
  return res.json();
}

export default { getFavorites, addFavorite, removeFavorite };
