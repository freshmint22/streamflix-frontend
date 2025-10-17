// src/services/api.ts
// @ts-ignore
const rawBase = import.meta.env.VITE_API_BASE as string | undefined;

/**
 * Base URL for backend API used throughout the client.
 * Reads from Vite environment variable VITE_API_BASE and falls back to localhost.
 * This value is exported so services can import a single source of truth.
 * @example
 * import { API_BASE } from './api';
 */
export const API_BASE = rawBase && rawBase !== "" ? rawBase : "http://localhost:5000";

if (!rawBase) {
  console.warn(
    "VITE_API_BASE is not defined. Using fallback:",
    API_BASE,
    "— create a .env.local with VITE_API_BASE=http://your-backend:port to avoid this."
  );
} else {
  console.log("Backend URL:", API_BASE);
}