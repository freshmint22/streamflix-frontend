// src/pages/Home.tsx
import { useEffect, useState } from "react";
import { getMovies, type Movie } from "../services/movies";
import MovieCard from "../components/MovieCard";
import Player from "../components/Player";

/**
 * Home page - lists movies and allows playing them using Player component.
 */
export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playingMovie, setPlayingMovie] = useState<any | null>(null);
  const posterFallback = "https://via.placeholder.com/240x360/111/fff?text=StreamFlix";

  useEffect(() => {
    (async () => {
      try {
        const data = await getMovies();   // Llama al backend (GET /movies)
        setMovies(data);
      } catch (e: any) {
        setError(e?.message || "Error cargando las películas");
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  if (loading) return <p style={{ textAlign: "center" }}>Cargando películas...</p>;
  if (error)
    return (
      <p style={{ color: "#e53935", textAlign: "center" }}>
        {error}
      </p>
    );

  return (
    <div style={styles.wrap}>
      <h1 style={{ margin: 0 }}>Bienvenido a StreamFlix</h1>
      <p style={{ color: "#666", marginTop: 8 }}>
        Catálogo actual (mock del backend):
      </p>

      {movies.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
          {movies.map((m) => {
            const mm = m as any;
            return (
              <MovieCard
                key={mm._id || mm.id}
                id={mm._id || mm.id}
                title={mm.title}
                year={mm.releaseYear || mm.year}
                poster={mm.thumbnailUrl || mm.posterUrl || posterFallback}
                videoUrl={mm.videoUrl}
                onPlay={(payload: any) => setPlayingMovie(payload)}
              />
            );
          })}
        </div>
      ) : (
        <p>No movies available.</p>
      )}

      {playingMovie && (
        <div style={{ marginTop: 20 }}>
          <Player movieId={playingMovie.id} videoUrl={playingMovie.videoUrl} onClose={() => setPlayingMovie(null)} />
        </div>
      )}
      <div style={styles.panel}>
        <h3 style={{ margin: "0 0 8px" }}>¿Qué viene en el Sprint 2?</h3>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
          <li>Listado de películas por género</li>
          <li>Buscador y filtros</li>
          <li>Reproducción, pausa y stop</li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  wrap: { maxWidth: 1000, margin: "10px auto" },
  panel: {
    marginTop: 18,
    padding: 16,
    border: "1px solid rgba(255,255,255,0.04)",
    borderRadius: 12,
    background: "var(--panel)",
  },
};
