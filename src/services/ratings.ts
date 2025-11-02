import { API_BASE } from "./api";

export type Rating = {
  _id?: string;
  movieId: string;
  userId?: string;
  value: number; // 1–5
};

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("sf_token") || ""}`,
  "Content-Type": "application/json",
});

export async function getRating(movieId: string): Promise<Rating | null> {
  const res = await fetch(`${API_BASE}/ratings/${movieId}`, { headers: authHeader() });
  if (!res.ok) return null;
  return res.json();
}

export async function setRating(movieId: string, value: number) {
  const res = await fetch(`${API_BASE}/ratings`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({ movieId, value }),
  });
  if (!res.ok) throw new Error("Error al guardar calificación");
  return res.json();
}

export async function getAverageRating(movieId: string): Promise<number> {
  const res = await fetch(`${API_BASE}/ratings/${movieId}/average`, { headers: authHeader() });
  if (!res.ok) return 0;
  const data = await res.json();
  return data.average || 0;
}

export default { getRating, setRating, getAverageRating };
