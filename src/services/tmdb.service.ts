import axios from "axios";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  release_date?: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
}

/**
 * Fetches popular movies from TMDB using the configured API key.
 */
export const getPopularMovies = async (): Promise<TmdbMovie[]> => {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB_API_KEY not configured");
  }

  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY,
        language: "es-ES",
        page: 1,
      },
    });
    return response.data?.results ?? [];
  } catch (error: any) {
    console.error("Error fetching TMDB movies:", error?.message || error);
    throw error;
  }
};
