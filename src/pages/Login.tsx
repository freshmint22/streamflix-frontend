/**
 * Login page component.
 *
 * Renders a form to authenticate users with email and password.
 * On success stores the JWT token in localStorage under `sf_token` and navigates to /home.
 * JSDoc and comments standardized in English.
 */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { CSSProperties } from "react";
import { login } from "../services/users";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "StreamFlix – Iniciar sesión";
  }, []);

  const isValidEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !pass) return setError("Completa todos los campos.");
    if (!isValidEmail(email)) return setError("Ingresa un correo válido.");

    setLoading(true);
    try {
      const resp: any = await login({ email, password: pass });

      const token = resp.token ?? resp;
      const username =
        resp.user?.firstName ||
        resp.user?.username ||
        resp.firstName ||
        resp.username ||
        "";

      localStorage.setItem("sf_token", token);
      if (username) localStorage.setItem("sf_username", username);
      if (resp.user?.email || email) {
        localStorage.setItem("sf_email", resp.user?.email || email);
      }
      if (resp.user?._id) {
        localStorage.setItem("sf_userId", resp.user._id);
      }

      navigate("/home");
    } catch {
      setError("Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <h1>Iniciar sesión</h1>
      <form onSubmit={onSubmit} style={styles.form}>
        <input
          className="input"
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="Contraseña"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button className="btn" type="submit" disabled={loading || !email || !pass}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <p style={{ marginTop: 10 }}>
        <Link to="/forgot">¿Olvidaste tu contraseña?</Link>
      </p>
      <p style={{ marginTop: 6 }}>
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: {
    maxWidth: 380,
    margin: "60px auto",
    padding: 20,
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 12,
    background: "var(--panel-light)",
    color: "#111",
  },
  form: { display: "flex", flexDirection: "column", gap: 12, marginTop: 10 },
  error: { color: "#e53935", margin: "-4px 0 0" },
};
