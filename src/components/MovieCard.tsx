import { useState } from "react";
import type { CSSProperties } from "react";
import favSvc from "../services/favorites";

type PlayPayload = {
  id: string;
  title: string;
  poster: string;
  year?: number;
  videoUrl?: string;
  overview?: string;
  rating?: number;
};

type MovieCardProps = {
  id: string;
  title: string;
  year?: number;
  poster?: string;
  videoUrl?: string;
  overview?: string;
  rating?: number;
  isFavorited?: boolean;
  onPlay?: (payload: PlayPayload) => void;
  onFavoriteRemoved?: (movieId: string) => void;
  onFavoriteAdded?: (payload: PlayPayload) => void;
};

export default function MovieCard({
  id,
  title,
  year,
  poster = "",
  videoUrl,
  overview,
  rating,
  isFavorited = false,
  onPlay,
  onFavoriteRemoved,
  onFavoriteAdded,
}: MovieCardProps) {
  const [fav, setFav] = useState<boolean>(isFavorited);
  const [busy, setBusy] = useState(false);

  const canPlay = Boolean(videoUrl);
  const playLabel = canPlay ? "Ver trailer" : "Sin video";
  const posterUrl = poster && poster.startsWith("http") ? poster : "https://via.placeholder.com/240x360/111/fff?text=StreamFlix";

  const payload: PlayPayload = {
    id,
    title,
    poster: posterUrl,
    year,
    videoUrl,
    overview,
    rating,
  };

  async function handleAdd() {
    try {
      setBusy(true);
      await favSvc.addFavorite({
        id,
        title,
        posterUrl,
        year,
        videoUrl,
        overview,
        rating,
      });
      setFav(true);
      onFavoriteAdded?.(payload);
    } catch (e) {
      console.error("Add favorite error", e);
      alert("Failed to add favorite");
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove() {
    try {
      setBusy(true);
      await favSvc.removeFavorite(id);
      setFav(false);
      onFavoriteRemoved?.(id);
    } catch (e) {
      console.error("Remove favorite error", e);
      alert("Failed to remove favorite");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={styles.card}>
      <div
        style={{
          ...styles.poster,
          backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0) 45%, rgba(15,23,42,0.92) 100%), url(${posterUrl})`,
        }}
      />
      <div style={styles.body}>
        <div>
          <h3 style={styles.title}>{title}</h3>
          <span style={styles.meta}>{year || "—"}</span>
        </div>
        <div style={styles.actions}>
          <button
            style={{
              ...styles.btnPrimary,
              opacity: canPlay ? 1 : 0.55,
              cursor: canPlay ? "pointer" : "not-allowed",
            }}
            onClick={() => canPlay && onPlay && onPlay(payload)}
            disabled={!canPlay}
          >
            {playLabel}
          </button>
          {!fav ? (
            <button style={styles.btnGhost} onClick={handleAdd} disabled={busy}>
              Añadir a favoritos
            </button>
          ) : (
            <button style={styles.btnDanger} onClick={handleRemove} disabled={busy}>
              Quitar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    display: "flex",
    flexDirection: "column",
    borderRadius: 24,
    overflow: "hidden",
    background:
      "linear-gradient(180deg, rgba(15,23,42,0.92), rgba(30,41,59,0.92))",
    border: "1px solid rgba(148,163,184,0.08)",
    boxShadow: "0 22px 45px rgba(8,15,35,0.35)",
  },
  poster: {
    height: 220,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "saturate(1.05)",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    padding: "16px 18px 20px",
    gap: 16,
  },
  title: {
    margin: 0,
    fontSize: "1.05rem",
    fontWeight: 600,
    color: "#f8fafc",
  },
  meta: {
    marginTop: 6,
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 10px",
    borderRadius: 999,
    background: "rgba(148,163,184,0.16)",
    color: "#cbd5f5",
    fontSize: 13,
    letterSpacing: "0.04em",
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
  },
  btnPrimary: {
    flex: "1 1 140px",
    minWidth: 140,
    padding: "10px 16px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg, #f97316 0%, #f43f5e 100%)",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 12px 30px rgba(244,63,94,0.35)",
  },
  btnGhost: {
    flex: "1 1 140px",
    minWidth: 140,
    padding: "10px 16px",
    borderRadius: 12,
    border: "1px solid rgba(248,250,252,0.18)",
    background: "transparent",
    color: "#e2e8f0",
    fontWeight: 600,
    cursor: "pointer",
  },
  btnDanger: {
    flex: "1 1 140px",
    minWidth: 140,
    padding: "10px 16px",
    borderRadius: 12,
    border: "1px solid rgba(248,113,113,0.4)",
    background: "rgba(248,113,113,0.16)",
    color: "#fca5a5",
    fontWeight: 600,
    cursor: "pointer",
  },
};
