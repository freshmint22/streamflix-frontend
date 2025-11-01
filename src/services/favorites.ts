import { API_BASE } from "./api";

/**
 * Favorites service.
 * Handles fetching, adding and removing favorite movies.
 */
export type FavoriteMovie = {
  id: string;
  title: string;
  posterUrl?: string;
  year?: number;
  videoUrl?: string;
};

export type FavoriteItem = {
  _id?: string;
  movieId: string;
  movie?: FavoriteMovie;
};

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("sf_token") || ""}`,
  "Content-Type": "application/json",
});

export async function getFavorites(): Promise<FavoriteItem[]> {
  const res = await fetch(`${API_BASE}/favorites`, { headers: authHeader() });
  if (!res.ok) throw new Error(`Failed to fetch favorites: ${res.status}`);
  const data = await res.json();

  // Normalizar estructura por si el backend devuelve movie inline
  return (data || []).map((item: any) => ({
    _id: item._id,
    movieId: item.movieId || item.movie?.id,
    movie: {
      id: item.movie?.id || item.movieId,
      title: item.movie?.title || item.title || "Sin título",
      posterUrl:
        item.movie?.posterUrl ||
        item.posterUrl ||
        "https://via.placeholder.com/240x360/111/fff?text=StreamFlix",
      year: item.movie?.year || item.year,
      videoUrl: item.movie?.videoUrl || item.videoUrl,
    },
  }));
}

export async function addFavorite(movie: FavoriteMovie) {
  const payload = {
    movieId: movie.id,
    movie: {
      id: movie.id,
      title: movie.title,
      posterUrl: movie.posterUrl,
      year: movie.year,
      videoUrl: movie.videoUrl,
    },
  };

  const res = await fetch(`${API_BASE}/favorites`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("❌ Add favorite error:", errText);
    throw new Error(`Failed to add favorite: ${res.status}`);
  }

  return res.json();
}

export async function removeFavorite(idOrMovieId: string) {
  try {
    const res = await fetch(`${API_BASE}/favorites/${idOrMovieId}`, {
      method: "DELETE",
      headers: authHeader(),
    });
    if (res.ok) return res.json();

    // Buscar por movieId si falla
    const list = await getFavorites();
    const f = list.find(
      (x) =>
        x._id === idOrMovieId ||
        x.movieId === idOrMovieId ||
        x.movie?.id === idOrMovieId
    );
    if (!f || !f._id) throw new Error("Favorite not found");
    const res2 = await fetch(`${API_BASE}/favorites/${f._id}`, {
      method: "DELETE",
      headers: authHeader(),
    });
    if (!res2.ok) throw new Error(`Failed to remove favorite: ${res2.status}`);
    return res2.json();
  } catch (e) {
    console.error("❌ removeFavorite error:", e);
    throw e;
  }
}

export default { getFavorites, addFavorite, removeFavorite };
