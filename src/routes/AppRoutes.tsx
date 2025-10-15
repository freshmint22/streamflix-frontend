import { Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "../components/Navbar";

function LayoutWithNav({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main style={{ padding: "20px", maxWidth: 1200, margin: "0 auto" }}>
        {children}
      </main>
    </>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<ForgotPassword />} />

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
    </Routes>
  );
}
