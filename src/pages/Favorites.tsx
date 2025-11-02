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

  useEffect(() => {
    (async () => {
      try {
        const data = await favSvc.getFavorites();
        // Mapeo para asegurar que cada favorito tenga todos los datos
        const mapped = data.map(f => ({
          movieId: f.movieId,
          title: f.title || f.movie?.title || "Sin título",
          year: f.year || f.movie?.year,
          posterUrl: f.posterUrl || f.movie?.posterUrl || posterFallback,
          videoUrl: f.videoUrl || f.movie?.videoUrl,
        }));
        setFavorites(mapped);
      } catch (err: any) {
        console.error("Error al cargar favoritos:", err);
        setError(err.message || "Error cargando favoritos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleRemoveFavorite = async (movieId: string) => {
    try {
      await favSvc.removeFavorite(movieId);
      setFavorites(prev => prev.filter(f => f.movieId !== movieId));
    } catch (err) {
      console.error("Error al remover favorito:", err);
    }
  };

  if (loading) return <p style={styles.loading}>Cargando favoritos...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Tus Favoritos ❤️</h1>

      {favorites.length === 0 ? (
        <p style={styles.empty}>No has agregado ninguna película a favoritos.</p>
      ) : (
        <div style={styles.grid}>
          {favorites.map(fav => (
            <div key={fav.movieId} style={{ width: "100%" }}>
              <MovieCard
                id={fav.movieId}
                title={fav.title}
                year={fav.year}
                poster={fav.posterUrl}
                videoUrl={fav.videoUrl}
                isFavorite={true}
                onPlay={m => setPlaying(m)}
                onToggleFavorite={() => handleRemoveFavorite(fav.movieId)}
              />
            </div>
          ))}
        </div>
      )}

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
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 28,
    justifyItems: "center",
    alignItems: "stretch",
    width: "100%",
  },
  empty: {
    color: "#94a3b8",
    textAlign: "center",
  },
  loading: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "1.2rem",
    marginTop: 40,
  },
  error: {
    color: "#ef4444",
    textAlign: "center",
    fontSize: "1.2rem",
    marginTop: 40,
  },
  playerShell: {
    marginTop: 40,
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
};
