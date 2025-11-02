import { API_BASE } from "./api";

export type RatingStats = {
  average: number | null;
  count: number;
};

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("sf_token") || ""}`,
  "Content-Type": "application/json",
  Accept: "application/json",
});

export async function getMyRating(movieId: string): Promise<number | null> {
  const res = await fetch(`${API_BASE}/ratings/me/${movieId}`, { headers: authHeader() });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`Unable to fetch your rating (${res.status}).`);
  const data = await res.json();
  return typeof data?.rating === "number" ? data.rating : null;
}

export async function upsertRating(movieId: string, rating: number) {
  const res = await fetch(`${API_BASE}/ratings`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({ movieId, rating }),
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Unable to save rating.");
  }
  return res.json();
}

export async function deleteRating(movieId: string) {
  const res = await fetch(`${API_BASE}/ratings/me/${movieId}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  if (!res.ok) throw new Error(`Unable to delete rating (${res.status}).`);
  return res.json();
}

export async function getRatingStats(movieId: string): Promise<RatingStats> {
  const res = await fetch(`${API_BASE}/ratings/stats/${movieId}`);
  if (!res.ok) return { average: null, count: 0 };
  const data = await res.json();
  return {
    average: typeof data?.average === "number" ? data.average : null,
    count: typeof data?.count === "number" ? data.count : 0,
  };
}

export default { getMyRating, upsertRating, deleteRating, getRatingStats };
