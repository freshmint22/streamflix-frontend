import axios from "axios";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const fallbackMovies: TmdbMovie[] = [
  {
    id: 810001,
    title: "El Último Horizonte",
    overview:
      "Una comandante espacial lucha por reunir a su tripulación mientras un experimento cuántico amenaza con borrar la estación orbital.",
    release_date: "2024-08-15",
    vote_average: 7.8,
  },
  {
    id: 810002,
    title: "Ritmos del Barrio",
    overview:
      "Un productor emergente descubre a una rapera que debe elegir entre la lealtad a su comunidad y un contrato millonario.",
    release_date: "2023-11-03",
    vote_average: 7.2,
  },
  {
    id: 810003,
    title: "Códigos Ocultos",
    overview:
      "Un criptógrafo encuentra un mensaje en una app de meditación que lo arrastra a un complot internacional.",
    release_date: "2025-02-21",
    vote_average: 8.4,
  },
  {
    id: 810004,
    title: "Bajo la Tormenta",
    overview:
      "Mientras un huracán golpea el Caribe, una capitana de barco debe rescatar a turistas atrapados en un archipiélago aislado.",
    release_date: "2024-05-31",
    vote_average: 7.0,
  },
];

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
    console.warn("TMDB_API_KEY not configured. Serving fallback movie dataset.");
    return fallbackMovies;
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
    const status = error?.response?.status;
    const statusText = error?.response?.statusText;
    const payload = error?.response?.data;
    console.error(
      "Error fetching TMDB movies:",
      status ? `${status} ${statusText || ""}`.trim() : error?.message || error
    );
    if (payload) {
      console.error("TMDB error payload:", payload);
    }
    console.warn("Serving fallback movie dataset due to TMDB failure.");
    return fallbackMovies;
  }
};
