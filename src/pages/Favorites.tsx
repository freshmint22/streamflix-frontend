import { useEffect, useState, type CSSProperties } from "react";
import favSvc, { FavoriteItem } from "../services/favorites";
import MovieCard from "../components/MovieCard";
import Player from "../components/Player";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playing, setPlaying] = useState<any | null>(null);

  const posterFallback =
    "https://via.placeholder.com/240x360/111/fff?text=StreamFlix";

  // 🔹 Cargar los favoritos desde el backend
  useEffect(() => {
    (async () => {
      try {
        const data = await favSvc.getFavorites();
        console.log("Favoritos cargados:", data);
        setFavorites(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Error al cargar favoritos:", err);
        setError(err.message || "Error cargando favoritos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🔹 Cuando se remueve un favorito
  function handleRemoved(id: string) {
    setFavorites((prev) =>
      prev.filter((f) => f.movieId !== id && f.movie?.id !== id)
    );
  }

  if (loading) return <p style={styles.loading}>Cargando favoritos...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Tus Favoritos ❤️</h1>

      {favorites.length === 0 ? (
        <p style={styles.empty}>No has agregado ninguna película a favoritos.</p>
      ) : (
        <div style={styles.grid}>
          {favorites.map((fav) => {
            const m = fav.movie || {};
            return (
              <MovieCard
                key={fav._id || fav.movieId}
                id={m.id || fav.movieId}
                title={m.title || "Sin título"}
                year={m.year}
                poster={m.posterUrl || m.poster || posterFallback}
                videoUrl={m.videoUrl || ""}
                isFavorited={true}
                onPlay={(movie) => setPlaying(movie)}
                onFavoriteRemoved={handleRemoved}
              />
            );
          })}
        </div>
      )}

      {/* 🔹 Reproductor de video */}
      {playing && (
        <div style={styles.playerShell}>
          <Player
            movieId={playing.id}
            videoUrl={playing.videoUrl}
            onClose={() => setPlaying(null)}
          />
        </div>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "48px 40px 100px",
    background:
      "linear-gradient(140deg, rgba(14,23,44,0.96), rgba(24,31,56,0.88))",
    color: "#e2e8f0",
    borderRadius: 32,
    boxShadow: "0 45px 120px rgba(5,11,26,0.55)",
    minHeight: "100vh",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 700,
    marginBottom: 32,
    color: "#f8fafc",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 28,
    justifyItems: "center",
    alignItems: "start",
  },
  empty: {
    color: "#94a3b8",
    textAlign: "center",
  },
  loading: {
    textAlign: "center",
    color: "#94a3b8",
  },
  error: {
    color: "#ef4444",
    textAlign: "center",
  },
  playerShell: {
    marginTop: 40,
  },
};

