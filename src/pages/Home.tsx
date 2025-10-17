// src/pages/Home.tsx
import { useEffect, useState } from "react";
import { getMovies, type Movie } from "../services/movies";

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getMovies();   // Llama al backend (GET /movies)
        setMovies(data);
      } catch (e: any) {
        setError(e?.message || "Error cargando las películas");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Cargando películas...</p>;
  if (error)
    return (
      <p style={{ color: "#e53935", textAlign: "center" }}>
        {error}
      </p>
    );

  return (
    <div style={styles.wrap}>
      <h1 style={{ margin: 0 }}>Bienvenido a StreamFlix</h1>
      <p style={{ color: "#666", marginTop: 8 }}>
        Catálogo actual (mock del backend):
      </p>

      {movies.length > 0 ? (
        <ul style={styles.list}>
          {movies.map((m) => (
            <li key={m.id} style={styles.item}>
              🎬 <strong>{m.title}</strong> {m.year && `(${m.year})`}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay películas disponibles.</p>
      )}

      <div style={styles.panel}>
        <h3 style={{ margin: "0 0 8px" }}>¿Qué viene en el Sprint 2?</h3>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
          <li>Listado de películas por género</li>
          <li>Buscador y filtros</li>
          <li>Reproducción, pausa y stop</li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  wrap: { maxWidth: 1000, margin: "10px auto" },
  panel: {
    marginTop: 18,
    padding: 16,
    border: "1px solid rgba(255,255,255,0.04)",
    borderRadius: 12,
    background: "var(--panel)",
  },
  list: { listStyle: "none", padding: 0, marginTop: 16 },
  item: {
    background: "var(--panel)",
    border: "1px solid rgba(255,255,255,0.04)",
    borderRadius: 8,
    padding: "10px 12px",
    marginBottom: 8,
  },
};
