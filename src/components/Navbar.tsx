import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";

interface NavbarProps {
  loggedIn: boolean;
  username?: string;
  onLogout?: () => void;
}

export default function Navbar({ loggedIn, username, onLogout }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <nav className="sf-navbar">
      <div className="sf-navbar__brand">
        <Link to="/">StreamFlix</Link>
      </div>

      <div className="sf-navbar__nav">
        {!loggedIn && (
          <>
            <Link className="sf-navbar__link" to="/">Inicio</Link>
            <Link className="sf-navbar__link" to="/login">Iniciar Sesión</Link>
            <Link className="sf-navbar__link" to="/register">Registrarse</Link>
            <Link className="sf-navbar__link" to="/about">Acerca de</Link>
          </>
        )}

        {loggedIn && (
          <>
            <Link className="sf-navbar__link" to="/home">Inicio</Link>
            <Link className="sf-navbar__link" to="/favorites">Favoritos</Link>

            <div className="sf-navbar__profile">
              <button className="sf-navbar__profile-btn" onClick={toggleDropdown}>
                {username ? `Perfil (${username})` : "Perfil"}
              </button>

              {dropdownOpen && (
                <div className="sf-navbar__profile-menu">
                  <Link to="/profile" className="sf-navbar__profile-item">Perfil</Link>
                  <Link to="/favorites" className="sf-navbar__profile-item">Favoritos</Link>
                  <button
                    className="sf-navbar__profile-item sf-navbar__logout"
                    onClick={onLogout}
                  >
                    Cerrar Sesión
                  </button>
                  <Link to="/sitemap" className="sf-navbar__profile-item">Mapa del Sitio</Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
