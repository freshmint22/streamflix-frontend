import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getMovies } from "../services/movies";
import { API_BASE } from "../services/api";

const posterFallback = "https://via.placeholder.com/400x600/111/fff?text=StreamFlix";

type TrailerState = {
  id: string;
  title: string;
  poster?: string;
  year?: number;
  videoUrl?: string;
  overview?: string;
  rating?: number;
};

type LocationState = { movie?: TrailerState } | undefined;

type TrailerMovie = TrailerState & { poster: string };

const starSymbols = { full: "★", empty: "☆" };

type UserReview = {
  id: string;
  user: string;
  rating: number;
  date: string;
  comment: string;
};

const userReviews: UserReview[] = [
  {
    id: "rev-1",
    user: "Camila P.",
    rating: 8.2,
    date: "Hace 2 días",
    comment:
      "Me encantó la química de los protagonistas y cómo evoluciona la historia. El ritmo es muy dinámico y el final deja con ganas de más.",
  },
  {
    id: "rev-2",
    user: "Marco L.",
    rating: 7.6,
    date: "Hace 5 días",
    comment:
      "Visualmente está muy bien lograda y la música acompaña perfecto. Algunas escenas se sienten apresuradas, pero sigue siendo muy disfrutable.",
  },
  {
    id: "rev-3",
    user: "Renata Q.",
    rating: 9.0,
    date: "Hace 1 semana",
    comment:
      "Superó mis expectativas. La narrativa profunda y los giros dramáticos mantienen la tensión hasta el final. Recomendadísima.",
  },
];

export default function Trailer() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const locationMovie = (location.state as LocationState)?.movie;
  const [movie, setMovie] = useState<TrailerMovie | null>(locationMovie ? withPoster(locationMovie) : null);
  const [loading, setLoading] = useState(!locationMovie);
  const [error, setError] = useState("");
  const [videoError, setVideoError] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastPositionRef = useRef(0);

  useEffect(() => {
    if (movie || !id) return;
    (async () => {
      try {
        setLoading(true);
        const list = await getMovies();
        const found = list.find((m) => String(m.id ?? (m as any)._id) === String(id));
        if (found) {
          setMovie(
            withPoster({
              id: String(found.id ?? (found as any)._id),
              title: found.title,
              poster: (found as any).thumbnailUrl || found.posterUrl,
              year: found.year ?? (found as any).releaseYear,
              videoUrl: found.videoUrl,
              overview: found.overview,
              rating: found.rating,
            })
          );
        } else {
          setError("No encontramos el trailer solicitado.");
        }
      } catch (err: any) {
        console.error("Cargar trailer error", err);
        setError("No pudimos cargar la película. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, movie]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [movie?.id]);

  useEffect(() => {
    const v = videoRef.current;
    if (!movie?.videoUrl || !v) return;

    setVideoError("");
    lastPositionRef.current = 0;
    v.pause();
    v.currentTime = 0;

    const tryPlay = () => v.play().catch((err) => {
      console.warn("Auto-play blocked", err);
      return undefined;
    });

    if (v.readyState >= 2) {
      void tryPlay();
    } else {
      const onReady = () => {
        v.removeEventListener("loadeddata", onReady);
        void tryPlay();
      };
      v.addEventListener("loadeddata", onReady);
      return () => v.removeEventListener("loadeddata", onReady);
    }
  }, [movie?.videoUrl]);

  useEffect(() => {
    const v = videoRef.current;
    if (!movie?.videoUrl || !v) return;

    const handleTime = () => {
      lastPositionRef.current = v.currentTime || 0;
    };
    const handlePlay = () => postPlayback("start", v.currentTime || 0, movie.id);
    const handlePause = () => postPlayback("pause", v.currentTime || 0, movie.id);
    const handleEnded = () => {
      lastPositionRef.current = 0;
      postPlayback("stop", 0, movie.id);
    };
    const handleError = () => setVideoError("No pudimos reproducir este trailer.");

    v.addEventListener("timeupdate", handleTime);
    v.addEventListener("play", handlePlay);
    v.addEventListener("pause", handlePause);
    v.addEventListener("ended", handleEnded);
    v.addEventListener("error", handleError);

    return () => {
      v.removeEventListener("timeupdate", handleTime);
      v.removeEventListener("play", handlePlay);
      v.removeEventListener("pause", handlePause);
      v.removeEventListener("ended", handleEnded);
      v.removeEventListener("error", handleError);
    };
  }, [movie?.videoUrl, movie?.id]);

  const ratingSummary = useMemo(() => buildRating(movie?.rating), [movie?.rating]);

  if (loading) {
    return <div style={styles.feedback}>Cargando trailer...</div>;
  }

  if (error) {
    return (
      <div style={styles.feedback} role="alert">
        {error}
        <br />
        <button style={styles.backButton} onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <section style={styles.page}>
      <header style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          &lt; Volver
        </button>
        <div>
          <h1 style={styles.title}>{movie.title}</h1>
          <p style={styles.meta}>
            {movie.year ? `${movie.year}` : "Sin fecha"}
            {ratingSummary && <span style={styles.rating}>{ratingSummary}</span>}
          </p>
        </div>
      </header>

      <div style={styles.media}>
        <div style={styles.videoColumn}>
          {movie.videoUrl ? (
            <video
              ref={videoRef}
              src={movie.videoUrl}
              controls
              autoPlay
              playsInline
              muted
              preload="metadata"
              style={styles.video}
            />
          ) : (
            <div style={styles.videoFallback}>
              No hay video disponible para este título.
            </div>
          )}
          {videoError && <p style={styles.videoError}>{videoError}</p>}
        </div>

        <aside style={styles.posterPanel}>
          <img src={movie.poster} alt="Poster de la película" style={styles.posterImg} />
          {typeof movie.rating === "number" && (
            <div style={styles.posterBadge}>
              <span style={styles.posterBadgeScore}>{movie.rating.toFixed(1)}</span>
              <span style={styles.posterBadgeLabel}>Rating global</span>
            </div>
          )}
        </aside>
      </div>

      <div style={styles.details}>
        <article style={styles.detailCard}>
          <h2 style={styles.sectionTitle}>Sinopsis</h2>
          <p style={styles.description}>{movie.overview || "No hay descripción disponible."}</p>
        </article>
        <article style={{ ...styles.detailCard, ...styles.ratingCard }}>
          <h2 style={styles.sectionTitle}>Valoración global</h2>
          {renderStars(movie.rating)}
          {ratingSummary ? (
            <p style={styles.ratingHeadline}>{ratingSummary}</p>
          ) : (
            <p style={styles.ratingHeadline}>Sin votos disponibles</p>
          )}
          {typeof movie.rating === "number" ? (
            <span style={styles.ratingDetail}>{movie.rating.toFixed(1)} / 10</span>
          ) : (
            <span style={styles.ratingDetail}>Sé el primero en valorarla</span>
          )}
        </article>
      </div>

      <section style={styles.reviewSection}>
        <h2 style={styles.sectionTitle}>Opiniones de usuarios</h2>
        <p style={styles.reviewIntro}>Lo que dice nuestra comunidad sobre este estreno.</p>
        <div style={styles.reviewGrid}>
          {userReviews.map((review) => (
            <article key={review.id} style={styles.reviewCard}>
              <div style={styles.reviewHeader}>
                <div style={styles.reviewAvatar}>{review.user.charAt(0)}</div>
                <div>
                  <p style={styles.reviewName}>{review.user}</p>
                  <span style={styles.reviewDate}>{review.date}</span>
                </div>
              </div>
              <div style={styles.reviewStars} aria-label={`Valoración ${review.rating}/10`}>
                {renderStarsCompact(review.rating)}
              </div>
              <p style={styles.reviewRating}>{review.rating.toFixed(1)} / 10</p>
              <p style={styles.reviewComment}>{review.comment}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

function withPoster(movie: TrailerState): TrailerMovie {
  return { ...movie, poster: movie.poster || posterFallback };
}

async function postPlayback(path: string, position: number, movieId: string) {
  const token = localStorage.getItem("sf_token") || "";
  if (!token) return;
  try {
    await fetch(`${API_BASE}/playback/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ movieId, position }),
    });
  } catch (err) {
    console.error("Guardar reproducción error", err);
  }
}

function buildRating(v?: number) {
  if (typeof v !== "number") return "";
  const fiveScale = Math.max(0, Math.min(5, Math.round((v / 2) * 10) / 10));
  return `${fiveScale.toFixed(1)}★ · ${v.toFixed(1)}/10`;
}

function renderStars(v?: number) {
  const rating = typeof v === "number" ? v : 0;
  const fullStars = Math.min(5, Math.max(0, Math.round(rating / 2)));
  const stars = Array.from({ length: 5 }, (_, i) => (i < fullStars ? starSymbols.full : starSymbols.empty)).join(" ");
  return <div style={styles.starRow} aria-label={`Valoración ${rating}/10`}>{stars}</div>;
}

function renderStarsCompact(v?: number) {
  const rating = typeof v === "number" ? v : 0;
  const fullStars = Math.min(5, Math.max(0, Math.round(rating / 2)));
  return Array.from({ length: 5 }, (_, i) => (i < fullStars ? starSymbols.full : starSymbols.empty)).join(" ");
}

const styles: Record<string, CSSProperties> = {
  page: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "48px 32px 120px",
    color: "#e2e8f0",
    background: "linear-gradient(150deg, rgba(13,17,38,0.95), rgba(10,22,48,0.92))",
    borderRadius: 32,
    boxShadow: "0 50px 120px rgba(3,10,28,0.55)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 24,
    marginBottom: 32,
  },
  backButton: {
    border: "1px solid rgba(226,232,240,0.25)",
    background: "transparent",
    color: "#e2e8f0",
    padding: "10px 18px",
    borderRadius: 999,
    cursor: "pointer",
    fontWeight: 600,
  },
  title: {
    margin: 0,
    fontSize: "2.75rem",
    fontWeight: 700,
    lineHeight: 1.1,
  },
  meta: {
    marginTop: 8,
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    gap: 16,
    fontSize: "1rem",
  },
  rating: {
    padding: "4px 12px",
    background: "rgba(59,130,246,0.18)",
    borderRadius: 999,
    color: "#bfdbfe",
    fontSize: "0.95rem",
  },
  media: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 3fr) minmax(240px, 1fr)",
    gap: 28,
    marginBottom: 36,
    alignItems: "stretch",
  },
  videoColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  video: {
    width: "100%",
    borderRadius: 24,
    backgroundColor: "#000",
    boxShadow: "0 30px 70px rgba(2,6,23,0.6)",
  },
  videoFallback: {
    width: "100%",
    minHeight: 320,
    borderRadius: 24,
    background: "rgba(15,23,42,0.6)",
    border: "1px solid rgba(148,163,184,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.1rem",
  },
  videoError: {
    color: "#fecaca",
    fontWeight: 600,
  },
  posterPanel: {
    position: "relative",
    borderRadius: 28,
    overflow: "hidden",
    boxShadow: "0 40px 120px rgba(8,8,35,0.55)",
    background: "rgba(15,23,42,0.6)",
    display: "flex",
    alignItems: "stretch",
  },
  posterImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  posterBadge: {
    position: "absolute",
    bottom: 20,
    left: 20,
    padding: "10px 16px",
    borderRadius: 16,
    background: "rgba(2,6,23,0.75)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(148,163,184,0.25)",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  posterBadgeScore: {
    fontSize: "1.6rem",
    fontWeight: 700,
    color: "#fbbf24",
    lineHeight: 1,
  },
  posterBadgeLabel: {
    fontSize: "0.8rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#cbd5f5",
  },
  details: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 24,
    marginBottom: 48,
  },
  detailCard: {
    background: "rgba(15,23,42,0.65)",
    padding: "26px 28px",
    borderRadius: 24,
    border: "1px solid rgba(148,163,184,0.14)",
    boxShadow: "0 25px 70px rgba(5,13,34,0.45)",
  },
  sectionTitle: {
    margin: "0 0 12px",
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#f8fafc",
    letterSpacing: "0.02em",
  },
  description: {
    margin: 0,
    color: "#cbd5f5",
    lineHeight: 1.6,
    fontSize: "1rem",
  },
  ratingCard: {
    background: "rgba(30,41,59,0.55)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    alignItems: "flex-start",
  },
  ratingHeadline: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "1rem",
    fontWeight: 600,
  },
  starRow: {
    fontSize: "1.4rem",
    letterSpacing: "0.35rem",
    color: "#fbbf24",
  },
  ratingDetail: {
    color: "#cbd5f5",
    fontSize: "0.95rem",
  },
  reviewSection: {
    background: "rgba(8,13,30,0.45)",
    padding: "36px 32px 40px",
    borderRadius: 28,
    border: "1px solid rgba(148,163,184,0.12)",
    boxShadow: "0 30px 90px rgba(4,10,28,0.45)",
  },
  reviewIntro: {
    margin: "0 0 24px",
    color: "#94a3b8",
  },
  reviewGrid: {
    display: "grid",
    gap: 20,
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  },
  reviewCard: {
    background: "rgba(15,23,42,0.75)",
    borderRadius: 20,
    border: "1px solid rgba(148,163,184,0.12)",
    padding: "22px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    boxShadow: "0 18px 60px rgba(3,10,28,0.4)",
  },
  reviewHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  reviewAvatar: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #38bdf8, #2563eb)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    color: "#fff",
    fontSize: "1.1rem",
  },
  reviewName: {
    margin: 0,
    fontWeight: 600,
    color: "#f8fafc",
  },
  reviewDate: {
    color: "#94a3b8",
    fontSize: "0.85rem",
  },
  reviewStars: {
    fontSize: "1.2rem",
    letterSpacing: "0.25rem",
    color: "#fbbf24",
  },
  reviewRating: {
    margin: 0,
    color: "#e2e8f0",
    fontWeight: 600,
  },
  reviewComment: {
    margin: 0,
    color: "#cbd5f5",
    lineHeight: 1.55,
    fontSize: "0.96rem",
  },
  feedback: {
    textAlign: "center",
    padding: "80px 20px",
    color: "#94a3b8",
  },
};
