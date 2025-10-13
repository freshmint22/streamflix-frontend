import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import Navbar from "../components/Navbar";

function LayoutWithNav({ children }) {
  return (
    <>
      <Navbar />
      <main style={{padding:"20px", maxWidth: 1200, margin: "0 auto"}}>{children}</main>
    </>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />

        {/* Privadas (simuladas) */}
        <Route path="/home" element={<LayoutWithNav><Home /></LayoutWithNav>} />
        <Route path="/profile" element={<LayoutWithNav><Profile /></LayoutWithNav>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

