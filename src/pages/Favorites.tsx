import { useEffect, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { getFavorites, type FavoriteItem } from "../services/favorites";
import MovieCard from "../components/MovieCard";

type PlayState = {
  id: string;
  title: string;
  videoUrl?: string;
  poster?: string;
  year?: number;
  overview?: string;
  rating?: number;
};

const posterFallback = "https://via.placeholder.com/240x360/111/fff?text=StreamFlix";

export default function Favorites() {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const list = await getFavorites();
        setItems(list || []);
      } catch (e: any) {
        setError(e?.message || "No pudimos cargar tus favoritos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleRemoved = (movieId: string) => {
    setItems((prev) => prev.filter((fav) => fav.movieId !== movieId && fav._id !== movieId));
  };

  const handlePlay = (payload: PlayState) => {
    navigate(`/trailer/${payload.id}`, { state: { movie: payload } });
  };

  if (loading) {
    return <div style={styles.feedback}>Cargando tus favoritos...</div>;
  }

  if (error) {
    return (
      <div style={styles.error} role="alert">
        {error}
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Tus favoritos</h1>
        <p style={styles.subtitle}>Encuentra rápidamente los títulos que guardaste y retoma sus avances cuando quieras.</p>
      </header>

      {items.length === 0 ? (
        <div style={styles.emptyCard}>
          <h2>No tienes favoritos guardados</h2>
          <p>Explora el catálogo y toca “Añadir a favoritos” en cualquier película que te guste.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {items.map((fav) => {
            const movieId = fav.movie?.id || fav.movieId;
            return (
              <MovieCard
                key={fav._id || movieId}
                id={movieId}
                title={fav.movie?.title || "Sin título"}
                year={fav.movie?.year}
                poster={fav.movie?.posterUrl || posterFallback}
                videoUrl={fav.movie?.videoUrl}
                overview={fav.movie?.overview}
                rating={fav.movie?.rating}
                isFavorited
                onPlay={handlePlay}
                onFavoriteRemoved={handleRemoved}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "48px 32px 96px",
    borderRadius: 28,
    background: "linear-gradient(150deg, rgba(13,23,42,0.95), rgba(24,29,55,0.9))",
    boxShadow: "0 40px 110px rgba(6,12,30,0.55)",
    color: "#e2e8f0",
    backdropFilter: "blur(10px)",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 28,
  },
  title: {
    margin: 0,
    fontSize: "2.5rem",
    fontWeight: 700,
    color: "#f8fafc",
  },
  subtitle: {
    margin: 0,
    maxWidth: 680,
    color: "#94a3b8",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 20,
  },
  feedback: {
    textAlign: "center",
    padding: "80px 20px",
    color: "#94a3b8",
  },
  error: {
    textAlign: "center",
    padding: "80px 20px",
    color: "#fda4af",
    fontWeight: 600,
  },
  emptyCard: {
    marginTop: 40,
    padding: "48px 32px",
    borderRadius: 24,
    background: "rgba(15,23,42,0.55)",
    border: "1px solid rgba(148,163,184,0.12)",
    textAlign: "center",
    color: "#cbd5f5",
  },
};
