import { NavLink, useNavigate } from "react-router-dom";
import type { CSSProperties } from "react";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("sf_token"); // 🔥 Cierra sesión real
    alert("Has cerrado sesión.");
    navigate("/login");
  };

  return (
    <header style={styles.header}>
      <div
        style={styles.brand}
        onClick={() => navigate("/home")}
        tabIndex={0}
        role="button"
        onKeyDown={(e) => e.key === "Enter" && navigate("/home")}
      >
        StreamFlix
      </div>

      <nav style={styles.nav} aria-label="Main navigation">
        <NavLink to="/home" style={({ isActive }) => styles.link(isActive)}>
          Home
        </NavLink>
        <NavLink to="/profile" style={({ isActive }) => styles.link(isActive)}>
          Perfil
        </NavLink>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Salir
        </button>
      </nav>
    </header>
  );
}

const styles: Record<string, any> = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    borderBottom: "1px solid #eee",
    background: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 10,
  } as CSSProperties,

  brand: {
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "18px",
  } as CSSProperties,

  nav: { display: "flex", gap: "14px", alignItems: "center" } as CSSProperties,

  link: (isActive: boolean): CSSProperties => ({
    textDecoration: "none",
    color: isActive ? "#111" : "#555",
    fontWeight: isActive ? "700" : "500",
  }),

  logoutBtn: {
    border: "none",
    background: "#e53935",
    color: "#fff",
    borderRadius: 8,
    padding: "8px 12px",
    cursor: "pointer",
  } as CSSProperties,
};
