import { useState, useEffect } from "react";
import ratingsSvc from "../services/ratings";

type StarRatingProps = {
  movieId: string;
  onRated?: (value: number) => void;
};

export default function StarRating({ movieId, onRated }: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const [rating, setRating] = useState(0);
  const [avg, setAvg] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await ratingsSvc.getRating(movieId);
        const a = await ratingsSvc.getAverageRating(movieId);
        if (r) setRating(r.value);
        setAvg(a);
      } catch {
        setAvg(0);
      } finally {
        setLoading(false);
      }
    })();
  }, [movieId]);

  async function handleRate(value: number) {
    try {
      setRating(value);
      await ratingsSvc.setRating(movieId, value);
      const avg = await ratingsSvc.getAverageRating(movieId);
      setAvg(avg);
      onRated?.(value);
    } catch {
      alert("Error guardando tu calificación");
    }
  }

  if (loading) return <p style={{ color: "#ccc" }}>Cargando calificación...</p>;

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
                  ? "#facc15" // amarillo
                  : "#475569", // gris
              transition: "color 0.2s",
            }}
          >
            ★
          </span>
        ))}
      </div>
      <p style={{ color: "#94a3b8", marginTop: 8, fontSize: 14 }}>
        Promedio: <strong>{avg.toFixed(1)}</strong> / 5
      </p>
    </div>
  );
}
