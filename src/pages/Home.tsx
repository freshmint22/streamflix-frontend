import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { getMovies, type Movie } from "../services/movies";
import favSvc from "../services/favorites";
import MovieCard from "../components/MovieCard";
import Player from "../components/Player";

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playingMovie, setPlayingMovie] = useState<any | null>(null);
  const posterFallback = "https://via.placeholder.com/240x360/111/fff?text=StreamFlix";
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const moviesData = await getMovies();
        setMovies(moviesData);

        const favs = await favSvc.getFavorites();
        setFavorites(favs.map(f => f.movieId)); // solo IDs
      } catch (e: any) {
        setError(e?.message || "Error cargando las películas");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleFavorite = async (movie: any) => {
    const movieId = movie._id || movie.id;
    try {
      if (favorites.includes(movieId)) {
        await favSvc.removeFavorite(movieId);
        setFavorites(favorites.filter(id => id !== movieId));
      } else {
        await favSvc.addFavorite({
          movieId,
          title: movie.title,
          year: movie.releaseYear || movie.year,
          posterUrl: movie.thumbnailUrl || movie.posterUrl,
          videoUrl: movie.videoUrl,
        });
        setFavorites([...favorites, movieId]);
      }
    } catch (e) {
      console.error("Error al actualizar favoritos", e);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Cargando películas...</p>;
  if (error) return <p style={{ color: "#e53935", textAlign: "center" }}>{error}</p>;

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
            const isFav = favorites.includes(mm._id || mm.id);
            return (
              <div key={mm._id || mm.id} style={styles.cardWrapper}>
                <MovieCard
                  id={mm._id || mm.id}
                  title={mm.title}
                  year={mm.releaseYear || mm.year}
                  poster={mm.thumbnailUrl || mm.posterUrl || posterFallback}
                  videoUrl={mm.videoUrl}
                  isFavorite={isFav}
                  onPlay={(payload: any) => setPlayingMovie(payload)}
                  onToggleFavorite={() => toggleFavorite(mm)}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <p style={styles.empty}>No movies available.</p>
      )}

      {playingMovie && (
        <div style={styles.playerShell}>
          <Player
            movieId={playingMovie.id}
            videoUrl={playingMovie.videoUrl}
            onClose={() => setPlayingMovie(null)}
          />
        </div>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
    alignItems: "center",
    textAlign: "center",
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
    justifyContent: "center",
    alignItems: "stretch",
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
  },
  cardWrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  empty: {
    marginTop: 36,
    color: "#94a3b8",
    textAlign: "center",
  },
  playerShell: {
    marginTop: 40,
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
};
