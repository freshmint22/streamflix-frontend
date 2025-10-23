import { useEffect, useState } from "react";
import { getFavorites } from "../services/favorites";

/**
 * Favorites page - lists the authenticated user's favorite movies.
 */
export default function Favorites() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const list = await getFavorites();
        setItems(list || []);
      } catch (e: any) {
        setError(e?.message || "Failed to load favorites");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{ maxWidth: 800, margin: "10px auto" }}>Loading favorites...</div>;
  if (error) return <div style={{ color: "#e53935" }}>{error}</div>;

  return (
    <div style={{ maxWidth: 900, margin: "10px auto" }}>
      <h1>Your favorites</h1>
      {items.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {items.map((f) => (
            <li key={f._id} style={{ padding: 12, borderBottom: "1px solid #eee" }}>
              <strong>{f.movie?.title || f.movieId}</strong>
              <div style={{ color: "#666" }}>{f.movie?.description}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
