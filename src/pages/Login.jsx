import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: llamar backend /auth/login
    if (email && pass) navigate("/home"); // simulación
  };

  return (
    <div style={styles.wrap}>
      <h1>Iniciar sesión</h1>
      <form onSubmit={onSubmit} style={styles.form}>
        <input placeholder="Correo" value={email} onChange={e=>setEmail(e.target.value)} style={styles.input}/>
        <input placeholder="Contraseña" type="password" value={pass} onChange={e=>setPass(e.target.value)} style={styles.input}/>
        <button type="submit" style={styles.btn}>Entrar</button>
      </form>
      <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
    </div>
  );
}

const styles = {
  wrap:{maxWidth:380, margin:"60px auto", padding:20, border:"1px solid #eee", borderRadius:12},
  form:{display:"flex", flexDirection:"column", gap:12, marginTop:10},
  input:{padding:"10px 12px", border:"1px solid #ddd", borderRadius:8},
  btn:{padding:"10px 12px", border:"none", borderRadius:8, background:"#111", color:"#fff", cursor:"pointer"}
};
