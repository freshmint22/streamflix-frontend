// src/services/users.ts
import { API_BASE } from "./api";

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = {
  firstName: string;
  lastName?: string;
  age?: number;
  email: string;
  password: string;
};

type LoginResponse = { token: string; user: unknown };
type Me = {
  id?: string;
  _id?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  email?: string;
  createdAt?: string;
};

function logout401() {
  try {
    localStorage.removeItem("sf_token");
  } finally {
    if (typeof window !== "undefined") window.location.assign("/login");
  }
}

function authHeaders() {
  const t = localStorage.getItem("sf_token") || "";
  return {
    Authorization: `Bearer ${t}`,
    "Content-Type": "application/json",
  };
}

async function toJsonOrError(res: Response) {
  let msg = "Request failed";
  try {
    const data = await res.json();
    if (!res.ok) {
      msg = (data?.message || data?.error || msg) as string;
      throw new Error(msg);
    }
    return data;
  } catch (e) {
    if (!res.ok) throw new Error(msg);
    // si no hay body pero fue OK (ej. 204), devuelve vacío
    return {};
  }
}

/**
 * Authenticate a user.
 * POST /auth/login
 * @param data Credentials object containing email and password
 * @returns Promise resolving to an object with { token, user }
 * @throws Error on authentication failure
 */
/** POST /auth/login */
export async function login(data: LoginPayload): Promise<LoginResponse> {
  const r = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (r.status === 401) logout401();
  if (!r.ok) {
    const body = await r.clone().json().catch(() => ({}));
    throw new Error(body?.message || body?.error || "Login failed");
  }
  return r.json();
}

/**
 * Register a new user.
 * POST /auth/register
 * @param data Registration payload
 * @returns Promise resolving to created user response
 * @throws Error on validation or server failure
 */
/** POST /auth/register */
export async function register(data: RegisterPayload) {
  const r = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) {
    const body = await r.clone().json().catch(() => ({}));
    throw new Error(body?.message || body?.error || "Register failed");
  }
  return r.json();
}

/**
 * Request password recovery email.
 * POST /auth/forgot-password
 * @param email User email to send a recovery link to
 * @returns Promise resolving to the server response
 * @throws Error on failure to request recovery
 */
/** POST /auth/forgot-password */
export async function recover(email: string) {
  const r = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!r.ok) {
    const body = await r.clone().json().catch(() => ({}));
    throw new Error(body?.message || body?.error || "Recovery failed");
  }
  return r.json();
}

/**
 * Get current authenticated user's profile.
 * GET /users/me
 * Requires Authorization header with Bearer token.
 * @returns Promise resolving to the user profile object
 */
/** GET /users/me (requires token) */
export async function getMe(): Promise<Me> {
  const r = await fetch(`${API_BASE}/users/me`, { headers: authHeaders() });
  if (r.status === 401) logout401();
  return toJsonOrError(r);
}

/**
 * Update current user's profile.
 * PUT /users/me
 * @param data Partial profile fields to update
 * @returns Promise resolving to updated user profile
 */
/** PUT /users/me (requires token) */
export async function updateMe(data: Partial<RegisterPayload>): Promise<Me> {
  const r = await fetch(`${API_BASE}/users/me`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (r.status === 401) logout401();
  return toJsonOrError(r);
}

/**
 * Delete the current authenticated user's account.
 * DELETE /users/me
 * @returns Promise resolving to deletion confirmation
 */
/** DELETE /users/me (requires token) */
export async function deleteMe() {
  const r = await fetch(`${API_BASE}/users/me`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (r.status === 401) logout401();
  // algunos back devuelven 204 sin body
  if (r.status === 204) return { ok: true };
  return toJsonOrError(r);
}
