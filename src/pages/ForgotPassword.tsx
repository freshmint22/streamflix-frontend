import { useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { recover } from "../services/users";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) return setError("Por favor, ingresa un correo válido.");

    try {
      setLoading(true);
      await recover(email); // 🔥 Llama al backend
      setSent(true);
    } catch (err: any) {
      setError("Error al enviar el correo. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <h1>Recuperar contraseña</h1>

      {!sent ? (
        <>
          <p style={{ color: "#666" }}>
            Ingresa tu correo y te enviaremos un enlace para restablecerla.
          </p>

          <form onSubmit={onSubmit} style={styles.form} aria-describedby="recover-msg">
            <input
              type="email"
              id="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.btn} disabled={loading}>
              {loading ? "Enviando..." : "Enviar enlace"}
            </button>
          </form>

          <div id="recover-msg" aria-live="assertive" style={{ minHeight: 20 }}>
            {error && <p style={styles.error}>{error}</p>}
          </div>

          <p style={{ marginTop: 10 }}>
            ¿Recordaste tu contraseña?{" "}
            <Link to="/login">Volver a iniciar sesión</Link>
          </p>
        </>
      ) : (
        <div style={styles.success} role="status" aria-live="polite">
          ✅ Enviamos un enlace a <strong>{email}</strong>. Revisa tu bandeja y sigue las instrucciones.
        </div>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: { maxWidth: 420, margin: "60px auto", padding: 20, border: "1px solid #eee", borderRadius: 12, background: "#fff" },
  form: { display: "flex", gap: 10, marginTop: 12 },
  input: { flex: 1, padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8 },
  btn: { padding: "10px 14px", border: "none", borderRadius: 8, background: "#111", color: "#fff", cursor: "pointer" },
  success: { marginTop: 12, padding: 12, border: "1px solid #d1f0d1", background: "#f2fff2", borderRadius: 8, color: "#1a7d1a" },
  error: { color: "#e53935", margin: "6px 0 0" },
};
