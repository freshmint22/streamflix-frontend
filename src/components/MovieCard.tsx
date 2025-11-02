import React, { useState } from "react";

type MovieCardProps = {
  id: string;
  title: string;
  year?: number;
  poster: string;
  videoUrl?: string;
  onPlay: (payload: any) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
};

export default function MovieCard({
  id,
  title,
  year,
  poster,
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

const cardStyles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 12,
    overflow: "hidden",
    cursor: "pointer",
  },
  poster: {
    width: "100%",
    borderRadius: 12,
    objectFit: "cover",
  },
  info: {
    marginTop: 12,
  },
  title: {
    margin: 0,
    fontSize: "1.1rem",
    color: "#f8fafc",
  },
  year: {
    margin: 0,
    fontSize: "0.9rem",
    color: "#94a3b8",
  },
  spacer: {
    flexGrow: 1,
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    gap: 8,
  },
  playButton: {
    flex: 1,
    padding: "6px 12px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontWeight: 600,
  },
  favoriteButton: {
    flex: 1,
    padding: "6px 12px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    color: "#fff",
    fontWeight: 600,
  },
};
