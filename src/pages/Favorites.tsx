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
    let active = true;

    (async () => {
      try {
        const data = await favSvc.getFavorites();
        if (!active) return;

        console.log("Favoritos cargados:", data);
        setFavorites(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (!active) return;

        console.error("Error al cargar favoritos:", err);
        setError(err.message || "Error cargando favoritos");
      } finally {
        if (!active) return;

        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
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
            const movie = fav.movie;
            const movieId = movie?.id ?? fav.movieId;
            const poster = movie?.posterUrl ?? movie?.poster ?? posterFallback;
            return (
              <MovieCard
                key={fav._id || movieId}
                id={movieId}
                title={movie?.title || "Sin título"}
                year={movie?.year}
                poster={poster}
                videoUrl={movie?.videoUrl || ""}
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
  banner: {
    marginBottom: 28,
    padding: "14px 18px",
    borderRadius: 16,
    background: "linear-gradient(90deg, rgba(249,115,22,0.18), rgba(244,63,94,0.18))",
    color: "#f8fafc",
    fontWeight: 600,
    letterSpacing: "0.01em",
    boxShadow: "0 18px 40px rgba(244,63,94,0.18)",
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
  card: {
    display: "flex",
    flexDirection: "column",
    padding: 22,
    borderRadius: 24,
    background: "rgba(15,23,42,0.72)",
    border: "1px solid rgba(148,163,184,0.14)",
    boxShadow: "0 30px 70px rgba(8,15,35,0.45)",
    gap: 18,
    transition: "transform 0.24s ease, box-shadow 0.24s ease",
  },
  cardHighlight: {
    boxShadow: "0 0 0 3px rgba(249,115,22,0.75), 0 38px 90px rgba(249,115,22,0.28)",
    transform: "translateY(-6px)",
  },
  posterButton: {
    border: "none",
    padding: 0,
    background: "transparent",
    cursor: "pointer",
    borderRadius: 20,
    overflow: "hidden",
  },
  posterImg: {
    width: "100%",
    aspectRatio: "2 / 3",
    objectFit: "cover",
    borderRadius: 20,
    boxShadow: "0 24px 60px rgba(8,15,35,0.45)",
    transition: "transform 0.24s ease",
  },
  cardBody: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    color: "#e2e8f0",
  },
  cardTitle: {
    margin: 0,
    fontSize: "1.25rem",
    fontWeight: 600,
    color: "#f8fafc",
  },
  cardMeta: {
    display: "flex",
    gap: 12,
    marginTop: 8,
    color: "#cbd5f5",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
  },
  cardOverview: {
    marginTop: 14,
    marginBottom: 0,
    color: "#94a3b8",
    fontSize: "0.95rem",
    lineHeight: 1.6,
  },
  cardActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
  },
  btnPrimary: {
    flex: "1 1 140px",
    minWidth: 140,
    padding: "11px 18px",
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(135deg, #f97316 0%, #f43f5e 100%)",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 16px 40px rgba(244,63,94,0.38)",
    transition: "transform 0.2s ease",
  },
  btnGhost: {
    flex: "1 1 120px",
    minWidth: 120,
    padding: "11px 18px",
    borderRadius: 14,
    border: "1px solid rgba(248,250,252,0.22)",
    background: "rgba(15,23,42,0.55)",
    color: "#e2e8f0",
    fontWeight: 600,
    cursor: "pointer",
  },
};

