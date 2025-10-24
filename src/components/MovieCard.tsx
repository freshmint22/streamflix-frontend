import { useState } from "react";
import type { CSSProperties } from "react";
import favSvc from "../services/favorites";

/**
 * MovieCard
 * Minimal card used across the app to display a movie.
 * Props: id (movie id), title, year, poster, videoUrl, isFavorited (optional), onPlay (optional callback)
 */
export default function MovieCard({ id, title, year, poster, videoUrl, isFavorited = false, onPlay }: any) {
  const [fav, setFav] = useState<boolean>(isFavorited);
  const [busy, setBusy] = useState(false);

  const authHeaders = () => {
    const t = localStorage.getItem("sf_token") || "";
    return { Authorization: `Bearer ${t}`, "Content-Type": "application/json" };
  };

  async function handleAdd() {
    try {
      setBusy(true);
      await favSvc.addFavorite(id);
      setFav(true);
    } catch (e) {
      console.error("Add favorite error", e);
      alert("Failed to add favorite");
    } finally { setBusy(false); }
  }

  async function handleRemove() {
    try {
  setBusy(true);
  // The backend returns the favorite id; client may need to know it.
  // For simplicity call removeFavorite with movie id path (service will try deletion by id then fallback to movieId lookup).
  await favSvc.removeFavorite(id);
      setFav(false);
    } catch (e) {
      console.error("Remove favorite error", e);
      alert("Failed to remove favorite");
    } finally { setBusy(false); }
  }

  const canPlay = Boolean(videoUrl);

  return (
    <div style={styles.card}>
      <div style={{ ...styles.poster, backgroundImage: `url(${poster})` }} />
      <div style={styles.info}>
        <strong>{title}</strong>
        <span style={{ color: "#777" }}>{year}</span>
      </div>

      <div style={{ display: "flex", gap: 8, padding: 12 }}>
        <button
          style={styles.btn}
          onClick={() => canPlay && onPlay && onPlay({ id, title, videoUrl })}
          disabled={!canPlay}
          aria-label={`Play ${title}`}
        >
          {canPlay ? "Play" : "No video"}
        </button>

        {!fav ? (
          <button style={styles.btnLight} onClick={handleAdd} disabled={busy} aria-label={`Add ${title} to favorites`}>
            Add to Favorites
          </button>
        ) : (
          <button style={styles.btnDanger} onClick={handleRemove} disabled={busy} aria-label={`Remove ${title} from favorites`}>
            Remove from Favorites
          </button>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  card: { border: "1px solid #eee", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" },
  poster: { height: 180, backgroundSize: "cover", backgroundPosition: "center" },
  info: { display: "flex", justifyContent: "space-between", padding: "10px 12px", alignItems: "center" },
  btn: { padding: "8px 10px", border: "none", borderRadius: 8, background: "#111", color: "#fff", cursor: "pointer" },
  btnLight: { padding: "8px 10px", border: "1px solid #ddd", borderRadius: 8, background: "#fff", cursor: "pointer" },
  btnDanger: { padding: "8px 10px", border: "none", borderRadius: 8, background: "#e53935", color: "#fff", cursor: "pointer" },
};
