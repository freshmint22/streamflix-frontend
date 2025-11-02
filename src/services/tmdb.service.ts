const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY as string | undefined;
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
    const url = new URL(`${TMDB_BASE_URL}/movie/popular`);
    url.searchParams.set("api_key", TMDB_API_KEY);
    url.searchParams.set("language", "es-ES");
    url.searchParams.set("page", "1");

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      const payload = await response.text();
      throw new Error(`TMDB request failed: ${response.status} ${response.statusText} ${payload}`.trim());
    }
    const data = await response.json();
    return data?.results ?? [];
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching TMDB movies:", error.message);
    } else {
      console.error("Error fetching TMDB movies:", error);
    }
    console.warn("Serving fallback movie dataset due to TMDB failure.");
    return fallbackMovies;
  }
};
