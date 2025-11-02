import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Sitemap.scss";

export default function Sitemap() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("sf_token"));

    // actualiza en tiempo real si cambia el token en otra pestaña
    const onStorage = (e: StorageEvent) => {
      if (e.key === "sf_token") setLoggedIn(!!e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <div className="sf-sitemap">
      <h1 className="sf-sitemap__title">Mapa del Sitio</h1>

      {!loggedIn ? (
        <div className="sf-sitemap__grid">
          <Link to="/" className="sf-sitemap__card">Inicio</Link>
          <Link to="/about" className="sf-sitemap__card">Acerca de</Link>
          <Link to="/login" className="sf-sitemap__card">Iniciar Sesión</Link>
          <Link to="/register" className="sf-sitemap__card">Registrarse</Link>
          <Link to="/forgot" className="sf-sitemap__card">Recuperar Contraseña</Link>
          <Link to="/sitemap" className="sf-sitemap__card">Mapa del Sitio</Link>
        </div>
      ) : (
        <div className="sf-sitemap__grid">
          <Link to="/home" className="sf-sitemap__card">Inicio</Link>
          <Link to="/profile" className="sf-sitemap__card">Perfil</Link>
          <Link to="/favorites" className="sf-sitemap__card">Favoritos</Link>
          <Link to="/about" className="sf-sitemap__card">Acerca de</Link>
          
          <Link to="/profile" className="sf-sitemap__card">Eliminar Cuenta</Link>
          <Link to="/sitemap" className="sf-sitemap__card">Mapa del Sitio </Link>
         <Link to="/forgot" className="sf-sitemap__card">Recuperar Contraseña</Link>
        </div>
      )}
    </div>
  );
}
