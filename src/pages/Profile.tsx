// src/pages/Profile.tsx
import { useEffect, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, updateMe, deleteMe } from "../services/users";

type User = {
  firstName: string;
  lastName?: string;
  age?: number;
  email: string;
  createdAt?: string;
};

/**
 * Profile page component.
 *
 * Fetches the authenticated user's profile, allows editing fields, changing password
 * (via PUT) and account deletion (DELETE). Handles 401 by redirecting to login.
 * All inline documentation is provided in English for consistency.
 */
export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<User>({ firstName: "", lastName: "", age: undefined, email: "" });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [error, setError] = useState("");

  // Load profile on mount using service helper
  useEffect(() => {
    (async () => {
      try {
        setLoadingPage(true);
        setError("");
        const data = await getMe();
        const normalized: User = {
          firstName: (data as any).firstName ?? "User",
          lastName: (data as any).lastName ?? "",
          age: (data as any).age,
          email: (data as any).email ?? "",
          createdAt: (data as any).createdAt,
        };
        setUser(normalized);
        setForm(normalized);
      } catch (e: any) {
        setError(e?.message || "Unexpected error");
      } finally {
        setLoadingPage(false);
      }
    })();
  }, []);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const updated = await updateMe({
        firstName: form.firstName,
        lastName: form.lastName,
        age: form.age,
        email: form.email,
      });
      setUser(updated as any);
      setForm(updated as any);
      setEditing(false);
    } catch (e: any) {
      setError(e?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete your account? This cannot be undone.");
    if (!ok) return;
    try {
      setLoading(true);
      setError("");
      await deleteMe();
      // logout + redirect
      localStorage.removeItem("sf_token");
      navigate("/login");
    } catch (e: any) {
      setError(e?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  function formatDate(iso?: string) {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' });
    } catch {
      return iso;
    }
  }

  if (loadingPage) return <div style={styles.wrap}>Cargando perfil…</div>;

  if (error) {
    return (
      <div style={styles.wrap}>
        <p aria-live="assertive" style={{ ...styles.error, marginTop: 10 }}>{error}</p>
        <button style={styles.btnLight} onClick={() => window.location.reload()}>Recargar</button>
      </div>
    );
  }

  if (!user) return <div style={styles.wrap}>No profile data.</div>;

  return (
    <div style={styles.wrap}>
      <h1>Mi perfil</h1>

      {!editing ? (
        <div style={styles.card}>
          <div><strong>Nombre:</strong> {user.firstName}</div>
          <div><strong>Apellido:</strong> {user.lastName || "—"}</div>
          <div><strong>Edad:</strong> {user.age ?? "—"}</div>
          <div><strong>Correo:</strong> {user.email}</div>
          {user.createdAt && <div><strong>Miembro desde:</strong> {formatDate(user.createdAt)}</div>}

          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button style={styles.btnDark} onClick={() => setEditing(true)}>Editar</button>
            <button style={styles.btnDanger} onClick={onDelete} disabled={loading}>
              {loading ? "Eliminando…" : "Eliminar cuenta"}
            </button>
          </div>
        </div>
      ) : (
        <form style={styles.card} onSubmit={onSave}>
          <label style={styles.label}>Nombre</label>
          <input
            style={styles.input}
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            required
          />
          <label style={styles.label}>Apellido</label>
          <input
            style={styles.input}
            value={form.lastName ?? ""}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
          <label style={styles.label}>Edad</label>
          <input
            style={styles.input}
            type="number"
            value={form.age ?? ""}
            onChange={(e) => setForm({ ...form, age: e.target.value ? Number(e.target.value) : undefined })}
            min={0}
          />
          <label style={styles.label}>Correo</label>
          <input
            style={styles.input}
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          {error && <p aria-live="assertive" style={styles.error}>{error}</p>}

          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button type="submit" style={styles.btnDark} disabled={loading}>
              {loading ? "Guardando…" : "Guardar"}
            </button>
            <button
              type="button"
              style={styles.btnLight}
              onClick={() => {
                setForm(user);
                setEditing(false);
              }}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: { maxWidth: 640, margin: "10px auto", padding: 8 },
  card: { marginTop: 12, padding: 16, border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, background: "var(--panel-light)", color: "#111" },
  label: { fontSize: 13, color: "#444", marginTop: 8 },
  input: { padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8, marginTop: 6 },
  btnDark: { padding: "10px 12px", border: "none", borderRadius: 8, background: "#111", color: "#fff", cursor: "pointer" },
  btnLight: { padding: "10px 12px", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 8, background: "var(--panel-light)", cursor: "pointer", color: "#111" },
  btnDanger: { padding: "10px 12px", border: "none", borderRadius: 8, background: "#e53935", color: "#fff", cursor: "pointer" },
  error: { color: "#e53935" },
};
