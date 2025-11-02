// src/services/api.ts

// Intentar leer la variable de entorno VITE_API_BASE
// y usar un valor por defecto válido si no existe.
const rawBase = import.meta.env.VITE_API_BASE as string | undefined;

// Verificamos que el valor exista y sea válido
const base =
  rawBase && /^https?:\/\//.test(rawBase)
    ? rawBase
    : "http://localhost:5000"; // fallback seguro

// Eliminamos barras finales duplicadas y agregamos /api
export const API_BASE = `${base.replace(/\/$/, "")}/api`;

// Solo para depuración
if (!rawBase) {
  console.warn(
    "⚠️ VITE_API_BASE no está definida. Usando fallback:",
    API_BASE,
    "→ crea un archivo .env.local con VITE_API_BASE=http://tu-backend:puerto"
  );
} else {
  console.log("✅ Backend URL:", API_BASE);
}
