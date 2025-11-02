// src/services/api.ts

// Attempt to read the Vite environment variable and fall back when absent.
const rawBase = import.meta.env.VITE_API_BASE as string | undefined;

// Ensure the value exists and looks like an HTTP URL
const base =
  rawBase && /^https?:\/\//.test(rawBase)
    ? rawBase
    : "http://localhost:5000"; // safe local fallback

// Remove duplicate trailing slashes and append /api
export const API_BASE = `${base.replace(/\/$/, "")}/api`;

// Useful debug output while developing locally
if (!rawBase) {
  console.warn(
    "⚠️ VITE_API_BASE is not defined. Using fallback:",
    API_BASE,
    "→ create a .env.local file with VITE_API_BASE=http://your-backend:port"
  );
} else {
  console.log("✅ Backend URL:", API_BASE);
}
