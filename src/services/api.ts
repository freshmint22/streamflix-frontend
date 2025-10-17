// src/services/api.ts
// @ts-ignore
const rawBase = import.meta.env.VITE_API_BASE as string | undefined;
// Fallback a localhost:3000 si no está definida la variable de entorno
export const API_BASE = rawBase && rawBase !== "" ? rawBase : "http://localhost:5000";
if (!rawBase) {
	console.warn(
		"VITE_API_BASE no está definida. Usando fallback:",
		API_BASE,
		"— crea un archivo .env.local con VITE_API_BASE=http://tu-backend:puerto para evitar esto."
	);
} else {
	console.log("Backend URL:", API_BASE);
}