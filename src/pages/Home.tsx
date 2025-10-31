// src/pages/Home.tsx
import { useEffect, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { getMovies, type Movie } from "../services/movies";
import MovieCard from "../components/MovieCard";

/**
 * Home page - lists movies and routes to the dedicated trailer experience.
 */
export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const posterFallback = "https://via.placeholder.com/240x360/111/fff?text=StreamFlix";
  const navigate = useNavigate();

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
    <div style={styles.page}>
      <header style={styles.hero}>
        <h1 style={styles.title}>Disfruta los estrenos estelares</h1>
        <p style={styles.subtitle}>
          Explora un catálogo curado, reproduce avances en un reproductor envolvente y guarda tus favoritos al instante.
        </p>
      </header>

      {movies.length > 0 ? (
        <div style={styles.grid}>
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
                overview={mm.overview}
                rating={mm.rating}
                onPlay={(payload) =>
                  navigate(`/trailer/${payload.id}`, {
                    state: { movie: { ...payload, poster: payload.poster || posterFallback } },
                  })
                }
              />
            );
          })}
        </div>
      ) : (
        <p style={styles.empty}>No movies available.</p>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    maxWidth: 1200,
    margin: "0 auto",
    marginTop: 16,
    padding: "48px 40px 100px",
    borderRadius: 32,
    background: "linear-gradient(140deg, rgba(14,23,44,0.96), rgba(24,31,56,0.88))",
    boxShadow: "0 45px 120px rgba(5,11,26,0.55)",
    color: "#e2e8f0",
    backdropFilter: "blur(12px)",
  },
  hero: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginBottom: 32,
  },
  title: {
    margin: 0,
    fontSize: "2.75rem",
    fontWeight: 700,
    lineHeight: 1.1,
    color: "#f8fafc",
  },
  subtitle: {
    margin: 0,
    maxWidth: 720,
    color: "#94a3b8",
    fontSize: "1.05rem",
    lineHeight: 1.6,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 20,
  },
  empty: {
    marginTop: 36,
    color: "#94a3b8",
  },
};
