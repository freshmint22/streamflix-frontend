import { API_BASE } from "./api";

export type CommentItem = {
  _id: string;
  movieId: string;
  userEmail: string;
  content: string;
  createdAt: string;
};

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("sf_token") || ""}`,
  "Content-Type": "application/json",
  Accept: "application/json",
});

/**
 * Fetches the public comment feed for a movie.
 */
export async function listComments(movieId: string): Promise<CommentItem[]> {
  if (!movieId) return [];
  const response = await fetch(`${API_BASE}/comments/${movieId}`);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Failed to get comments (${response.status}).`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) return [];
  return data as CommentItem[];
}

/**
 * Persists a new comment for the current authenticated user.
 */
export async function createComment(movieId: string, content: string): Promise<CommentItem> {
  const trimmed = content.trim();
  if (!movieId || !trimmed) {
    throw new Error("movieId and content are required.");
  }
  const response = await fetch(`${API_BASE}/comments`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ movieId, content: trimmed }),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Failed to save the comment (${response.status}).`);
  }
  return response.json() as Promise<CommentItem>;
}

export default { listComments, createComment };
