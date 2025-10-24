// src/pages/Sitemap.tsx
import { Link } from "react-router-dom";

export default function Sitemap() {
  const routes = [
    { path: "/", name: "Inicio" },
    { path: "/home", name: "Inicio (Usuarios)" },
    { path: "/about", name: "Acerca de" },
    { path: "/login", name: "Iniciar Sesión" },
    { path: "/register", name: "Registrarse" },
    { path: "/forgot", name: "Recuperar Contraseña" },
    { path: "/profile", name: "Perfil" },
    { path: "/favorites", name: "Favoritos" },
    { path: "/sitemap", name: "Mapa del Sitio" },
  ];

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        borderRadius: "16px",
        backgroundColor: "var(--panel)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
          color: "#ffffff", // blanco puro
          textShadow: "0 2px 6px rgba(0,0,0,0.6)", // sombra sutil para contraste
          fontWeight: "900",
          letterSpacing: "0.5px",
        }}
      >
        Mapa del Sitio
      </h1>

      <ul style={{ listStyle: "none", padding: 0, fontSize: "18px" }}>
        {routes.map((r) => (
          <li
            key={r.path}
            style={{
              margin: "12px 0",
              backgroundColor: "var(--panel-light)",
              borderRadius: "12px",
              padding: "10px 15px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              transition: "transform 0.2s ease, box-shadow 0.3s ease",
            }}
          >
            <Link
              to={r.path}
              style={{
                textDecoration: "none",
                color: "#7a5cff", // azul metálico brillante
                fontWeight: "600",
              }}
            >
              {r.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
