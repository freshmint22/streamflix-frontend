import { API_BASE } from "./api";

/**
 * Favorites service.
 * Handles fetching, adding and removing favorite movies.
 */
export type FavoriteMovie = {
  id: string;
  title: string;
  posterUrl?: string;
  poster?: string;
  year?: number;
  videoUrl?: string;
  overview?: string;
  rating?: number;
};

export type FavoriteItem = {
  _id?: string;
  movieId: string;
  title?: string;
  year?: number;
  posterUrl?: string;
  videoUrl?: string;
};

const token = () => localStorage.getItem("sf_token") || "";

export default {
  async getFavorites(): Promise<FavoriteItem[]> {
    const res = await fetch(`${API_BASE}/favorites`, {
      headers: { Authorization: `Bearer ${token()}` },
    });
    if (!res.ok) throw new Error("Failed to fetch favorites");
    const data = await res.json();

    // Traemos todas las películas para completar los datos faltantes
    const allMovies = await getMovies();

    return data.map((f: any) => {
      const movie = allMovies.find(
        (m: any) => m.id === f.movieId || m._id === f.movieId
      );
      return {
        _id: f._id,
        movieId: f.movieId,
        title: f.title || movie?.title || "Sin título",
        year: f.year || movie?.releaseYear || movie?.year,
        posterUrl:
          f.posterUrl ||
          movie?.thumbnailUrl ||
          movie?.posterUrl ||
          "https://via.placeholder.com/240x360/111/fff?text=StreamFlix",
        videoUrl: f.videoUrl || movie?.videoUrl || "",
      };
    });
  },

  async addFavorite(movie: FavoriteItem): Promise<FavoriteItem> {
    if (!movie.movieId) throw new Error("movieId is required");

    const res = await fetch(`${API_BASE}/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token()}`,
      },
      body: JSON.stringify(movie),
    });
    if (!res.ok) throw new Error("Failed to add favorite");
    return res.json();
  },

  async removeFavorite(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/favorites/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token()}` },
    });
    if (!res.ok) throw new Error("Failed to remove favorite");
  },
};
