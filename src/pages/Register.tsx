// src/pages/Register.tsx
import { useEffect, useState, type CSSProperties } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerUser } from "../services/users";

type Form = {
  firstName: string;
  lastName: string;
  age: string; // guardamos como string para controlar el input; convertimos al enviar
  email: string;
  password: string;
};

/**
 * Register page component.
 *
 * Allows users to create a new account by providing first name, last name, age, email and password.
 * Performs client-side validation and calls the users service to register the account on the server.
 * Documentation: JSDoc in English for consistency across the project.
 */
export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "StreamFlix – Crear cuenta";
  }, []);

  const isValidEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOk("");

    const { firstName, lastName, age, email, password } = form;

    if (!firstName || !email || !password)
      return setError("Completa los campos obligatorios (Nombre, Correo y Contraseña).");

    if (!isValidEmail(email)) return setError("Ingresa un correo válido.");
    if (password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");

    const ageNum = age ? Number(age) : undefined;
    if (age && (!Number.isFinite(ageNum) || ageNum! < 0)) {
      return setError("Edad inválida.");
    }

    try {
      setLoading(true);
      const resp = await registerUser({
        firstName,
        lastName: lastName || undefined,
        age: ageNum,
        email,
        password,
      });

      // Nuestro backend mock devuelve { token, user }
      const token = (resp as any)?.token as string | undefined;
      if (token) {
        localStorage.setItem("sf_token", token);
        setOk("✅ Cuenta creada. Entrando…");
        // pequeña pausa visual y navegar
        setTimeout(() => navigate("/home"), 600);
      } else {
        setOk("✅ Cuenta creada. Redirigiendo a iniciar sesión…");
        setTimeout(() => navigate("/login"), 800);
      }
    } catch (err: any) {
      setError(err?.message || "Error creando la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <h1>Crear cuenta</h1>

      <form onSubmit={onSubmit} style={styles.form} aria-describedby="register-msg">
        <label style={styles.label} htmlFor="firstName">Nombre*</label>
        <input
          id="firstName"
          className="input"
          placeholder="Nombre"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          required
          style={styles.input}
        />

        <label style={styles.label} htmlFor="lastName">Apellidos</label>
        <input
          id="lastName"
          className="input"
          placeholder="Apellidos"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          style={styles.input}
        />

        <label style={styles.label} htmlFor="age">Edad</label>
        <input
          id="age"
          className="input"
          placeholder="Edad"
          type="number"
          min={0}
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          style={styles.input}
        />

        <label style={styles.label} htmlFor="email">Correo*</label>
        <input
          id="email"
          className="input"
          placeholder="Correo"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          style={styles.input}
        />

        <label style={styles.label} htmlFor="password">Contraseña* (mín. 6)</label>
        <input
          id="password"
          className="input"
          placeholder="Contraseña"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          style={styles.input}
        />

        <div id="register-msg" aria-live="assertive" style={{ minHeight: 20 }}>
          {error && <p style={styles.error}>{error}</p>}
          {ok && <p style={styles.ok}>{ok}</p>}
        </div>

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Creando..." : "Registrarme"}
        </button>
      </form>

      <p style={{ marginTop: 10 }}>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: { maxWidth: 420, margin: "60px auto", padding: 20, border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, background: "var(--panel-light)", color: "#111" },
  form: { display: "flex", flexDirection: "column", gap: 12, marginTop: 10 },
  label: { fontSize: 13, color: "#666", marginTop: 8 },
  input: { padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8, marginTop: 6 },
  error: { color: "#e53935", margin: "-4px 0 0" },
  ok: { color: "#1a7d1a", margin: "-4px 0 0" },
};
