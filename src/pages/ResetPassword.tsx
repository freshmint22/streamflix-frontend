import { useState, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../services/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      setMessage("Token inválido o expirado.");
      return;
    }
    if (!password) {
      setMessage("Ingresa una nueva contraseña.");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API_BASE}/password/reset-password/${token}`, { password });
      setMessage("Contraseña restablecida correctamente. Redirigiendo...");
      setTimeout(() => navigate("/login"), 1800);
    } catch (error) {
      console.error(error);
      setMessage("Error al restablecer la contraseña");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Restablecer contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "8px", margin: "10px", width: "250px" }}
        />
        <button type="submit" style={{ padding: "8px 16px" }} disabled={submitting}>
          {submitting ? "Guardando..." : "Cambiar contraseña"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}