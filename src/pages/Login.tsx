/**
 * Login page component.
 * Renders a form to authenticate users with email and password.
 * On success stores the JWT token in localStorage under `sf_token` and navigates to /home.
 */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { CSSProperties } from "react";
import { login } from "../services/users";
import { API_BASE } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => { document.title = "StreamFlix – Iniciar sesión"; }, []);

  const isValidEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !pass) return setError("Completa todos los campos.");
    if (!isValidEmail(email)) return setError("Ingresa un correo válido.");

    setLoading(true);
    try {
      const { token } = await login({ email, password: pass });
      localStorage.setItem("sf_token", token);
      navigate("/home");
    } catch {
      setError("Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  const demoEnabled = (import.meta.env.VITE_ALLOW_DEMO as string) === 'true';

  const onDemo = async () => {
    setError("");
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/auth/demo-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: 'Demo' }),
      });
      if (!r.ok) throw new Error('Demo login failed');
      const data = await r.json();
      const token = (data as any)?.token;
      if (!token) throw new Error('No token from demo');
      localStorage.setItem('sf_token', token);
      navigate('/home');
    } catch (err: any) {
      setError(err?.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <h1>Iniciar sesión</h1>
      <form onSubmit={onSubmit} style={styles.form}>
        <input className="input" type="email" placeholder="Correo"
               value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Contraseña"
               value={pass} onChange={(e) => setPass(e.target.value)} />
        {error && <p style={styles.error}>{error}</p>}
        <button className="btn" type="submit" disabled={loading || !email || !pass}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
        {demoEnabled && (
          <button type="button" className="btn" style={{ marginTop: 8 }} onClick={onDemo} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar como demo'}
          </button>
        )}
      </form>
      <p style={{ marginTop: 10 }}><Link to="/forgot">¿Olvidaste tu contraseña?</Link></p>
      <p style={{ marginTop: 6 }}>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
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