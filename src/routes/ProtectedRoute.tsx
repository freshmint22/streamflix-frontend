import { Navigate } from "react-router-dom";

/**
 * Protege rutas privadas del usuario
 * Verifica si existe un token válido en localStorage
 */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("sf_token");

  if (!token) {
    // Si no hay token, redirige al login
    return <Navigate to="/login" replace />;
  }

  // Si hay token, permite renderizar la página
  return children;
}
