// src/components/Footer.tsx
import type { CSSProperties } from "react";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <nav aria-label="Mapa del sitio" style={styles.nav}>
        <a href="/home" style={styles.link}>Inicio</a>
        <a href="/profile" style={styles.link}>Perfil</a>
        <a href="/register" style={styles.link}>Registro</a>
        <a href="/login" style={styles.link}>Iniciar sesión</a>
        <a href="/forgot" style={styles.link}>Recuperar contraseña</a>
        <a href="/about" style={styles.link}>Sobre nosotros</a>
      </nav>
      <p style={styles.copy}>© 2025 StreamFlix – Todos los derechos reservados.</p>
    </footer>
  );
}

const styles: Record<string, CSSProperties> = {
  footer: {
    borderTop: "1px solid #eee",
    padding: "20px",
    textAlign: "center",
    marginTop: "40px",
    background: "#fafafa",
  },
  nav: {
    display: "flex",
    flexWrap: "wrap",          // ✅ ahora tipa bien
    justifyContent: "center",
    gap: "12px",
    marginBottom: "10px",
  },
  link: { color: "#444", textDecoration: "none" },
  copy: { color: "#666", fontSize: "13px" },
};

