import { useState, useEffect } from "react";
import ratingsSvc, { type RatingStats } from "../services/ratings";

type StarRatingProps = {
  movieId: string;
  onRated?: (value: number) => void;
};

export default function StarRating({ movieId, onRated }: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const [rating, setRating] = useState(0);
  const [stats, setStats] = useState<RatingStats>({ average: null, count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [myRating, stat] = await Promise.all([
          ratingsSvc.getMyRating(movieId).catch(() => null),
          ratingsSvc.getRatingStats(movieId),
        ]);
        if (!active) return;
        setStats(stat);
        if (typeof myRating === "number" && myRating > 0) setRating(myRating);
        else setRating(0);
      } catch (err: any) {
        if (!active) return;
        setError(err?.message || "Unable to load ratings.");
        setStats({ average: null, count: 0 });
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [movieId]);

  async function handleRate(value: number) {
    const previous = rating;
    try {
      setRating(value);
      setError(null);
      await ratingsSvc.upsertRating(movieId, value);
      const updatedStats = await ratingsSvc.getRatingStats(movieId);
      setStats(updatedStats);
      onRated?.(value);
    } catch (err: any) {
  setError(err?.message || "Unable to save your rating.");
      setRating((prev) => (prev === value ? previous : prev));
    }
  }

  async function handleRemove() {
    try {
      await ratingsSvc.deleteRating(movieId);
      setRating(0);
      const updatedStats = await ratingsSvc.getRatingStats(movieId);
      setStats(updatedStats);
    } catch (err: any) {
      setError(err?.message || "Unable to remove your rating.");
    }
  }

  if (loading) return <p style={{ color: "#ccc" }}>Loading rating…</p>;

  return (
    <div style={{ textAlign: "center", marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
        {[1, 2, 3, 4, 5].map((value) => (
          <span
            key={value}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(0)}
            onClick={() => handleRate(value)}
            style={{
              cursor: "pointer",
              fontSize: 28,
              color:
                value <= (hover || rating)
                  ? "#facc15" // gold
                  : "#475569", // slate
              transition: "color 0.2s",
            }}
          >
            ★
          </span>
        ))}
      </div>
      <p style={{ color: "#94a3b8", marginTop: 8, fontSize: 14 }}>
        Average: <strong>{(stats.average ?? 0).toFixed(1)}</strong> / 5 · {stats.count} votes
      </p>
      {rating > 0 && (
        <button
          type="button"
          onClick={handleRemove}
          style={{
            marginTop: 8,
            background: "transparent",
            border: "none",
            color: "#f87171",
            cursor: "pointer",
            fontSize: 13,
            textDecoration: "underline",
          }}
        >
          Remove my rating
        </button>
      )}
      {error && (
        <p style={{ color: "#f87171", marginTop: 6, fontSize: 13 }}>
          {error}
        </p>
      )}
    </div>
  );
}
