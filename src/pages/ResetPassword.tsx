import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/auth/reset-password", { token, password });
      setMessage("Contraseña restablecida correctamente");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error(error);
      setMessage("Error al restablecer la contraseña");
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
        <button type="submit" style={{ padding: "8px 16px" }}>Cambiar contraseña</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
