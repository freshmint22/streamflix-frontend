import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FaMap } from "react-icons/fa"; // 👈 Importamos el ícono de mapa
import "./Navbar.scss";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const isRoot = location.pathname === "/";
  const isAuthed = Boolean(localStorage.getItem("sf_token"));

  const handleLogout = () => {
    localStorage.removeItem("sf_token");
    alert("Has cerrado sesión.");
    navigate("/login");
  };

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setOpen(false);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="sf-navbar">
      <div
        className="sf-navbar__brand"
        onClick={() => navigate("/home")}
        tabIndex={0}
        role="button"
        onKeyDown={(e) => e.key === "Enter" && navigate("/home")}
      >
        StreamFlix
      </div>

      <nav className="sf-navbar__nav" aria-label="Main navigation">
        <NavLink to="/home" className={({ isActive }) => (isActive ? 'sf-navbar__link active' : 'sf-navbar__link')}>Home</NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? 'sf-navbar__link active' : 'sf-navbar__link')}>Sobre nosotros</NavLink>
        {isAuthed && (
          <NavLink
            to="/favorites"
            className={({ isActive }) => (isActive ? 'sf-navbar__link active' : 'sf-navbar__link')}
          >
            Favoritos
          </NavLink>
        )}
        
        {/* Enlace al Sitemap con ícono */}
        <NavLink
          to="/sitemap"
          className={({ isActive }) => (isActive ? 'sf-navbar__link active sf-navbar__sitemap' : 'sf-navbar__link sf-navbar__sitemap')}
        >
          <FaMap style={{ marginRight: 6 }} /> Mapa del Sitio
        </NavLink>

        {isRoot ? (
          <button className="btn-primary" onClick={() => navigate('/login')} aria-label="Iniciar sesión">Iniciar sesión</button>
        ) : (
          <button className="sf-navbar__toggle" aria-label="Open menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen(s => !s)}>
            <span className="sf-navbar__hamburger" />
          </button>
        )}

        {isAuthed && (
          <div className="sf-navbar__profile" ref={menuRef}>
            <button
              aria-haspopup="true"
              aria-expanded={open}
              className="sf-navbar__profile-btn"
              onClick={() => setOpen((s) => !s)}
            >
              Perfil
            </button>

            {open && (
              <div className="sf-navbar__profile-menu" role="menu">
                <button className="sf-navbar__profile-item" onClick={() => navigate('/profile')} role="menuitem">Ver perfil</button>
                <button className="sf-navbar__profile-item" onClick={handleLogout} role="menuitem">Cerrar sesión</button>
              </div>
            )}
          </div>
        )}
      </nav>

      {mobileOpen && (
        <div className="sf-navbar__mobile" role="dialog" aria-modal="true" onClick={() => setMobileOpen(false)}>
          <div className="sf-navbar__mobile-inner" onClick={(e) => e.stopPropagation()}>
            <NavLink to="/home" onClick={() => setMobileOpen(false)} className={({ isActive }) => (isActive ? 'sf-navbar__link active' : 'sf-navbar__link')}>Home</NavLink>
            <NavLink to="/about" onClick={() => setMobileOpen(false)} className={({ isActive }) => (isActive ? 'sf-navbar__link active' : 'sf-navbar__link')}>Sobre nosotros</NavLink>
            {isAuthed && (
              <NavLink
                to="/favorites"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => (isActive ? 'sf-navbar__link active' : 'sf-navbar__link')}
              >
                Favoritos
              </NavLink>
            )}
            <NavLink to="/sitemap" onClick={() => setMobileOpen(false)} className={({ isActive }) => (isActive ? 'sf-navbar__link active sf-navbar__sitemap' : 'sf-navbar__link sf-navbar__sitemap')}>
              <FaMap style={{ marginRight: 6 }} /> Mapa del Sitio
            </NavLink>

            <div className="sf-navbar__mobile-section">
              <h3>Opciones</h3>
              {isAuthed ? (
                <>
                  <button onClick={() => { setMobileOpen(false); navigate('/profile'); }} className="sf-navbar__link">Perfil</button>
                  <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="sf-navbar__link">Salir</button>
                </>
              ) : (
                <button onClick={() => { setMobileOpen(false); navigate('/login'); }} className="sf-navbar__link">Iniciar sesión</button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
