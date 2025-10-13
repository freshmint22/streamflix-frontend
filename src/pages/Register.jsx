import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: llamar backend /auth/register
    if (name && email && pass) navigate("/"); // vuelve a login
  };

  return (
    <div style={styles.wrap}>
      <h1>Crear cuenta</h1>
      <form onSubmit={onSubmit} style={styles.form}>
        <input placeholder="Nombre" value={name} onChange={e=>setName(e.target.value)} style={styles.input}/>
        <input placeholder="Correo" value={email} onChange={e=>setEmail(e.target.value)} style={styles.input}/>
        <input placeholder="Contraseña" type="password" value={pass} onChange={e=>setPass(e.target.value)} style={styles.input}/>
        <button type="submit" style={styles.btn}>Registrarme</button>
      </form>
      <p>¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link></p>
    </div>
  );
}

const styles = {
  wrap:{maxWidth:420, margin:"60px auto", padding:20, border:"1px solid #eee", borderRadius:12},
  form:{display:"flex", flexDirection:"column", gap:12, marginTop:10},
  input:{padding:"10px 12px", border:"1px solid #ddd", borderRadius:8},
  btn:{padding:"10px 12px", border:"none", borderRadius:8, background:"#111", color:"#fff", cursor:"pointer"}
};
