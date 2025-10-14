// src/pages/Profile.tsx
import { useEffect, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE as string;

type User = {
  firstName: string;
  lastName?: string;
  age?: number;
  email: string;
  createdAt?: string;
};

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<User>({ firstName: "", lastName: "", age: undefined, email: "" });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [error, setError] = useState("");

  // Helper para cabeceras con token
  const authHeaders = () => {
    const token = localStorage.getItem("sf_token") || "";
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // Manejo de 401: limpiar y mandar a login
  const handle401 = () => {
    localStorage.removeItem("sf_token");
    navigate("/login");
  };

  // Cargar perfil al montar
  useEffect(() => {
    (async () => {
      try {
        setLoadingPage(true);
        setError("");
        const res = await fetch(`${API_BASE}/users/me`, { headers: authHeaders() });
        if (res.status === 401) return handle401();
        if (!res.ok) throw new Error("Failed to load profile");
        const data = (await res.json()) as Partial<User>;
        // Normaliza los campos mínimos esperados
        const normalized: User = {
          firstName: data.firstName ?? "User",
          lastName: data.lastName ?? "",
          age: data.age,
          email: data.email ?? "",
          createdAt: data.createdAt,
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
      const res = await fetch(`${API_BASE}/users/me`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          age: form.age,
          email: form.email,
        }),
      });
      if (res.status === 401) return handle401();
      if (!res.ok) throw new Error("Update failed");
      const updated = (await res.json()) as User;
      setUser(updated);
      setForm(updated);
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
      const res = await fetch(`${API_BASE}/users/me`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.status === 401) return handle401();
      if (!res.ok) throw new Error("Delete failed");
      // logout + redirect
      localStorage.removeItem("sf_token");
      navigate("/login");
    } catch (e: any) {
      setError(e?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  if (loadingPage) return <div style={styles.wrap}>Loading profile…</div>;

  if (error) {
    return (
      <div style={styles.wrap}>
        <p aria-live="assertive" style={{ ...styles.error, marginTop: 10 }}>{error}</p>
        <button style={styles.btnLight} onClick={() => window.location.reload()}>Reload</button>
      </div>
    );
  }

  if (!user) return <div style={styles.wrap}>No profile data.</div>;

  return (
    <div style={styles.wrap}>
      <h1>My Profile</h1>

      {!editing ? (
        <div style={styles.card}>
          <div><strong>First name:</strong> {user.firstName}</div>
          <div><strong>Last name:</strong> {user.lastName || "—"}</div>
          <div><strong>Age:</strong> {user.age ?? "—"}</div>
          <div><strong>Email:</strong> {user.email}</div>
          {user.createdAt && <div><strong>Member since:</strong> {user.createdAt}</div>}

          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button style={styles.btnDark} onClick={() => setEditing(true)}>Edit</button>
            <button style={styles.btnDanger} onClick={onDelete} disabled={loading}>
              {loading ? "Deleting…" : "Delete account"}
            </button>
          </div>
        </div>
      ) : (
        <form style={styles.card} onSubmit={onSave}>
          <label style={styles.label}>First name</label>
          <input
            style={styles.input}
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            required
          />
          <label style={styles.label}>Last name</label>
          <input
            style={styles.input}
            value={form.lastName ?? ""}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
          <label style={styles.label}>Age</label>
          <input
            style={styles.input}
            type="number"
            value={form.age ?? ""}
            onChange={(e) => setForm({ ...form, age: e.target.value ? Number(e.target.value) : undefined })}
            min={0}
          />
          <label style={styles.label}>Email</label>
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
              {loading ? "Saving…" : "Save"}
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
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: { maxWidth: 640, margin: "10px auto", padding: 8 },
  card: { marginTop: 12, padding: 16, border: "1px solid #eee", borderRadius: 12, background: "#fff" },
  label: { fontSize: 13, color: "#666", marginTop: 8 },
  input: { padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8, marginTop: 6 },
  btnDark: { padding: "10px 12px", border: "none", borderRadius: 8, background: "#111", color: "#fff", cursor: "pointer" },
  btnLight: { padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8, background: "#fff", cursor: "pointer" },
  btnDanger: { padding: "10px 12px", border: "none", borderRadius: 8, background: "#e53935", color: "#fff", cursor: "pointer" },
  error: { color: "#e53935" },
};
