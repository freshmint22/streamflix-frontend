import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: integrar con backend: POST /auth/forgot-password
    if (email) setSent(true);
  };

  return (
    <div style={styles.wrap}>
      <h1>Recuperar contraseña</h1>
      {!sent ? (
        <>
          <p style={{color:"#666"}}>
            Ingresa tu correo y te enviaremos un enlace para restablecerla.
          </p>
          <form onSubmit={onSubmit} style={styles.form}>
            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.btn}>Enviar enlace</button>
          </form>
          <p style={{marginTop:10}}>
            ¿Recordaste tu contraseña? <Link to="/login">Volver a iniciar sesión</Link>
          </p>
        </>
      ) : (
        <div style={styles.success}>
          ✅ Enviamos un enlace a <strong>{email}</strong>. Revisa tu bandeja y sigue las instrucciones.
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap:{maxWidth:420, margin:"60px auto", padding:20, border:"1px solid #eee", borderRadius:12, background:"#fff"},
  form:{display:"flex", gap:10, marginTop:12},
  input:{flex:1, padding:"10px 12px", border:"1px solid #ddd", borderRadius:8},
  btn:{padding:"10px 14px", border:"none", borderRadius:8, background:"#111", color:"#fff", cursor:"pointer"},
  success:{marginTop:12, padding:12, border:"1px solid #d1f0d1", background:"#f2fff2", borderRadius:8, color:"#1a7d1a"}
};
