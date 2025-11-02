// src/routes/AppRoutes.tsx
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import About from "../pages/About";
import Favorites from "../pages/Favorites";
import Sitemap from "../pages/Sitemap";
import Trailer from "../pages/Trailer";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ResetPassword from "../pages/ResetPassword";

function LayoutWithNav({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  // ✅ Mantener login y nombre sincronizados
  const [loggedIn, setLoggedIn] = useState<boolean>(() => !!localStorage.getItem("sf_token"));
  const [username, setUsername] = useState<string | undefined>(() => localStorage.getItem("sf_username") || undefined);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("sf_token"));
    setUsername(localStorage.getItem("sf_username") || undefined);
  }, [location]);

  // ✅ Escucha cambios en otra pestaña
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "sf_token") setLoggedIn(!!e.newValue);
      if (e.key === "sf_username") setUsername(e.newValue || undefined);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ✅ Logout sin recargar todo el sitio
  const handleLogout = () => {
    localStorage.removeItem("sf_token");
    localStorage.removeItem("sf_username");
    localStorage.removeItem("sf_email");
    localStorage.removeItem("sf_userId");
    setLoggedIn(false);
    setUsername(undefined);
    window.location.href = "/";
  };

  return (
    <>
      <Navbar loggedIn={loggedIn} username={username} onLogout={handleLogout} />
      <main style={{ padding: "20px", maxWidth: 1200, margin: "0 auto", paddingBottom: 80 }}>
        {children}
      </main>
      <Footer />
    </>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<LayoutWithNav><Landing /></LayoutWithNav>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/about" element={<LayoutWithNav><About /></LayoutWithNav>} />

      {/* Privadas */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <LayoutWithNav><Home /></LayoutWithNav>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <LayoutWithNav><Profile /></LayoutWithNav>
          </ProtectedRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <LayoutWithNav><Favorites /></LayoutWithNav>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trailer/:id"
        element={
          <ProtectedRoute>
            <LayoutWithNav>
              <Trailer />
            </LayoutWithNav>
          </ProtectedRoute>
        }
      />

      <Route path="/sitemap" element={<LayoutWithNav><Sitemap /></LayoutWithNav>} />
    </Routes>
  );
}
