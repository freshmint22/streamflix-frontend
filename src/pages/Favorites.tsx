import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getFavorites, removeFavorite, type FavoriteItem, type FavoriteMovie } from "../services/favorites";
import { getMovies, type Movie } from "../services/movies";

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
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const enrichMetadata = useCallback(async (raw: FavoriteItem[]) => {
    if (!raw.length) return raw;

    const missingIds = raw
      .filter((fav) => !fav.movie || !fav.movie.title || !fav.movie.posterUrl)
      .map((fav) => fav.movieId)
      .filter((id, idx, arr) => arr.indexOf(id) === idx);

    if (missingIds.length === 0) return raw;

    let catalog: Movie[] = [];
    try {
      catalog = await getMovies();
    } catch (catErr) {
      console.warn("No pudimos obtener el catálogo para enriquecer favoritos", catErr);
    }

    const mapById = new Map<string, Movie>();
    catalog.forEach((movie) => {
      const m: any = movie;
      const primaryId = m._id || m.id;
      if (primaryId) {
        mapById.set(String(primaryId), movie);
      }
    });

    return raw.map((fav) => {
      const movieMeta: FavoriteMovie | undefined = fav.movie;
      const catalogMovie = mapById.get(String(fav.movieId));
      const merged = {
        id: movieMeta?.id || String(fav.movieId),
        title: movieMeta?.title || (catalogMovie as any)?.title,
        posterUrl:
          movieMeta?.posterUrl || (catalogMovie as any)?.posterUrl || (catalogMovie as any)?.thumbnailUrl,
        year: movieMeta?.year || (catalogMovie as any)?.year || (catalogMovie as any)?.releaseYear,
        videoUrl: movieMeta?.videoUrl || (catalogMovie as any)?.videoUrl,
        overview: movieMeta?.overview || (catalogMovie as any)?.overview,
        rating:
          typeof movieMeta?.rating === "number"
            ? movieMeta?.rating
            : typeof (catalogMovie as any)?.rating === "number"
              ? (catalogMovie as any)?.rating
              : undefined,
      };

      return { ...fav, movie: merged };
    });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const list = await getFavorites();
        const enriched = await enrichMetadata(list || []);
        setItems(enriched);
      } catch (e: any) {
        setError(e?.message || "No pudimos cargar tus favoritos");
      } finally {
        setLoading(false);
      }
    })();
  }, [enrichMetadata]);

  useEffect(() => {
    const state = (location.state as { highlightId?: string } | null) || null;
    if (state?.highlightId) {
      setHighlightId(state.highlightId);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  useEffect(() => {
    if (!highlightId) return;
    const element = document.getElementById(`favorite-${highlightId}`);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
    const timer = window.setTimeout(() => setHighlightId(null), 4000);
    return () => window.clearTimeout(timer);
  }, [highlightId, items.length]);

  const handlePlay = (payload: PlayState) => {
    navigate(`/trailer/${payload.id}`, { state: { movie: payload } });
  };

  const handleRemove = async (favoriteKey: string, movieId: string) => {
    try {
      setRemovingId(favoriteKey);
      await removeFavorite(favoriteKey);
      setItems((prev) => prev.filter((fav) => fav._id !== favoriteKey && fav.movieId !== movieId));
    } catch (e) {
      console.error("Remove favorite error", e);
      alert("No pudimos quitar este favorito, intenta nuevamente.");
    } finally {
      setRemovingId(null);
    }
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

      {highlightId && items.some((fav) => fav.movie?.id === highlightId || fav.movieId === highlightId) && (
        <div style={styles.banner}>¡Listo! Tu película se agregó a favoritos.</div>
      )}

      {items.length === 0 ? (
        <div style={styles.emptyCard}>
          <h2>No tienes favoritos guardados</h2>
          <p>Explora el catálogo y toca “Añadir a favoritos” en cualquier película que te guste.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {items.map((fav) => {
            const movieId = fav.movie?.id || fav.movieId;
            const favoriteKey = fav._id || movieId;
            const movieMeta = fav.movie;
            const poster = movieMeta?.posterUrl || posterFallback;
            const title = movieMeta?.title || "Sin título";
            const canPlay = Boolean(movieMeta?.videoUrl);
            const releaseYear = movieMeta?.year;
            const ratingValue = typeof movieMeta?.rating === "number" ? movieMeta.rating : undefined;
            const payload: PlayState = {
              id: movieId,
              title,
              videoUrl: movieMeta?.videoUrl,
              poster,
              year: releaseYear,
              overview: movieMeta?.overview,
              rating: ratingValue,
            };

            return (
              <article
                key={favoriteKey}
                id={`favorite-${movieId}`}
                style={{
                  ...styles.card,
                  ...(highlightId === movieId ? styles.cardHighlight : {}),
                }}
              >
                <button
                  type="button"
                  style={styles.posterButton}
                  onClick={() => canPlay && handlePlay(payload)}
                  aria-label={`Ver trailer de ${title}`}
                >
                  <img
                    src={poster}
                    alt={`Póster de ${title}`}
                    style={styles.posterImg}
                    onError={(evt) => {
                      const img = evt.currentTarget as HTMLImageElement;
                      if (img.src !== posterFallback) img.src = posterFallback;
                      img.onerror = null;
                    }}
                  />
                </button>

                <div style={styles.cardBody}>
                  <div>
                    <h3 style={styles.cardTitle}>{title}</h3>
                    <div style={styles.cardMeta}>
                      {releaseYear && <span>{releaseYear}</span>}
                      {typeof ratingValue === "number" && <span>★ {ratingValue.toFixed(1)}</span>}
                    </div>
                    {movieMeta?.overview && <p style={styles.cardOverview}>{movieMeta.overview}</p>}
                  </div>

                  <div style={styles.cardActions}>
                    <button
                      style={{
                        ...styles.btnPrimary,
                        opacity: canPlay ? 1 : 0.6,
                        cursor: canPlay ? "pointer" : "not-allowed",
                      }}
                      onClick={() => canPlay && handlePlay(payload)}
                      disabled={!canPlay}
                    >
                      Ver trailer
                    </button>
                    <button
                      style={styles.btnGhost}
                      onClick={() => handleRemove(favoriteKey, movieId)}
                      disabled={removingId === favoriteKey}
                    >
                      {removingId === favoriteKey ? "Quitando..." : "Quitar"}
                    </button>
                  </div>
                </div>
              </article>
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
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 24,
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
