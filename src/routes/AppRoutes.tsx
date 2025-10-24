import { Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import About from "../pages/About";
import Favorites from "../pages/Favorites";
import Sitemap from "../pages/Sitemap";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ResetPassword from "../pages/ResetPassword";


function LayoutWithNav({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
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
      <Route
        path="/about"
        element={
          <LayoutWithNav>
            <About />
          </LayoutWithNav>
        }
      />

      {/* Privadas */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <LayoutWithNav>
              <Home />
            </LayoutWithNav>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <LayoutWithNav>
              <Profile />
            </LayoutWithNav>
          </ProtectedRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <LayoutWithNav>
              <Favorites />
            </LayoutWithNav>
          </ProtectedRoute>
        }
      />

      <Route
        path="/sitemap"
        element={
          <LayoutWithNav>
            <Sitemap />
          </LayoutWithNav>
        }
      />
    </Routes>
  );
}
