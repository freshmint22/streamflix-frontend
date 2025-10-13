import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
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
        {/* públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* privadas (simuladas por ahora) */}
        <Route path="/home" element={<LayoutWithNav><Home /></LayoutWithNav>} />
        <Route path="/profile" element={<LayoutWithNav><Profile /></LayoutWithNav>} />
      </Routes>
    </BrowserRouter>
  );
}
