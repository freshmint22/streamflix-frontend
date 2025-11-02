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
  onPlay,
  isFavorite = false,
  onToggleFavorite,
}: MovieCardProps) {
  const [hovered, setHovered] = useState(false);

  const payload: PlayPayload = {
    id,
    title,
    poster,
    year,
    videoUrl,
    overview,
    rating,
  };

  return (
    <div
      style={{
        ...cardStyles.container,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 12px 24px rgba(0,0,0,0.3)"
          : "0 4px 12px rgba(0,0,0,0.2)",
        transition: "all 0.2s ease-in-out",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img src={poster} alt={title} style={cardStyles.poster} />
      <div style={cardStyles.info}>
        <h3 style={cardStyles.title}>{title}</h3>
        {year && <p style={cardStyles.year}>{year}</p>}
      </div>
      <div style={cardStyles.spacer} />
      <div style={cardStyles.buttons}>
        <button
          style={{
            ...cardStyles.playButton,
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e40af")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
          onClick={() => onPlay({ id, videoUrl })}
        >
          Reproducir
        </button>
        <button
          style={{
            ...cardStyles.favoriteButton,
            backgroundColor: isFavorite ? "#ef4444" : "#f97316",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = isFavorite ? "#dc2626" : "#fb923c")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = isFavorite ? "#ef4444" : "#f97316")
          }
          onClick={onToggleFavorite}
        >
          {isFavorite ? "Favorito" : "Agregar"}
        </button>
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
