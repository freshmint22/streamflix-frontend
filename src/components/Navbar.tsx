import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
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
    // prefer a friendly message in Spanish
    alert("Has cerrado sesión.");
    navigate("/login");
  };

  // close on outside click
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  // close mobile menu and profile on Escape
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

  // no explicit close button; overlay closes on backdrop click or Escape

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
        <NavLink to="/home" className={({ isActive }) => (isActive ? 'sf-navbar__link active' : 'sf-navbar__link')}>
          Home
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? 'sf-navbar__link active' : 'sf-navbar__link')}>
          Sobre nosotros
        </NavLink>

        {/* show login button on landing (root) otherwise hamburger toggle */}
        {isRoot ? (
          <button className="btn-primary" onClick={() => navigate('/login')} aria-label="Iniciar sesión">
            Iniciar sesión
          </button>
        ) : (
          <button className="sf-navbar__toggle" aria-label="Open menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen(s => !s)}>
            <span className="sf-navbar__hamburger" />
          </button>
        )}

        {/* Profile dropdown */}
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
      {/* mobile overlay menu */}
      {mobileOpen && (
        <div className="sf-navbar__mobile" role="dialog" aria-modal="true" onClick={() => setMobileOpen(false)}>
          <div className="sf-navbar__mobile-inner" onClick={(e) => e.stopPropagation()}>
            {/* overlay closes when clicking outside or pressing Escape */}
            <NavLink to="/home" onClick={() => setMobileOpen(false)} className={({ isActive }) => (isActive ? 'sf-navbar__link active' : 'sf-navbar__link')}>Home</NavLink>
            <NavLink to="/about" onClick={() => setMobileOpen(false)} className={({ isActive }) => (isActive ? 'sf-navbar__link active' : 'sf-navbar__link')}>Sobre nosotros</NavLink>

            <div className="sf-navbar__mobile-section">
              <h3>Opciones</h3>
              <button onClick={() => { setMobileOpen(false); navigate('/profile'); }} className="sf-navbar__link">Perfil</button>
              <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="sf-navbar__link">Salir</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
