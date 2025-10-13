import { useState } from "react";

const MOCK_USER = {
  name: "Anderson",
  email: "anderson@example.com",
  createdAt: "2025-10-01"
};

export default function Profile() {
  const [user, setUser] = useState(MOCK_USER);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(MOCK_USER);

  const onSave = (e) => {
    e.preventDefault();
    // TODO: integrar con backend: PUT /users/me
    setUser(form);
    setEditing(false);
  };

  const onDelete = () => {
    // TODO: integrar con backend: DELETE /users/me
    alert("Cuenta eliminada (simulado). Redirigir a /");
  };

  return (
    <div style={styles.wrap}>
      <h1>Mi Perfil</h1>

      {!editing ? (
        <div style={styles.card}>
          <div><strong>Nombre:</strong> {user.name}</div>
          <div><strong>Correo:</strong> {user.email}</div>
          <div><strong>Miembro desde:</strong> {user.createdAt}</div>

          <div style={{display:"flex", gap:10, marginTop:14}}>
            <button style={styles.btnDark} onClick={()=>setEditing(true)}>Editar</button>
            <button style={styles.btnDanger} onClick={onDelete}>Eliminar cuenta</button>
          </div>
        </div>
      ) : (
        <form style={styles.card} onSubmit={onSave}>
          <label style={styles.label}>Nombre</label>
          <input
            style={styles.input}
            value={form.name}
            onChange={(e)=>setForm({...form, name:e.target.value})}
          />
          <label style={styles.label}>Correo</label>
          <input
            style={styles.input}
            value={form.email}
            onChange={(e)=>setForm({...form, email:e.target.value})}
          />
          <div style={{display:"flex", gap:10, marginTop:14}}>
            <button type="submit" style={styles.btnDark}>Guardar</button>
            <button type="button" style={styles.btnLight} onClick={()=>{setForm(user); setEditing(false);}}>Cancelar</button>
          </div>
        </form>
      )}
    </div>
  );
}

const styles = {
  wrap:{maxWidth:640, margin:"10px auto"},
  card:{marginTop:12, padding:16, border:"1px solid #eee", borderRadius:12, background:"#fff"},
  label:{fontSize:13, color:"#666", marginTop:8},
  input:{padding:"10px 12px", border:"1px solid #ddd", borderRadius:8, marginTop:6},
  btnDark:{padding:"10px 12px", border:"none", borderRadius:8, background:"#111", color:"#fff", cursor:"pointer"},
  btnLight:{padding:"10px 12px", border:"1px solid #ddd", borderRadius:8, background:"#fff", cursor:"pointer"},
  btnDanger:{padding:"10px 12px", border:"none", borderRadius:8, background:"#e53935", color:"#fff", cursor:"pointer"}
};
