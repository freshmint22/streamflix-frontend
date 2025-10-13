import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <header style={styles.header}>
      <div style={styles.brand} onClick={() => navigate("/home")}>StreamFlix</div>
      <nav style={styles.nav}>
        <NavLink to="/home" style={styles.link}>Home</NavLink>
        <NavLink to="/profile" style={styles.link}>Perfil</NavLink>
        <NavLink to="/" style={styles.link}>Salir</NavLink>
      </nav>
    </header>
  );
}

const styles = {
  header: {display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 20px",borderBottom:"1px solid #eee"},
  brand: {fontWeight:"700",cursor:"pointer"},
  nav: {display:"flex",gap:"14px"},
  link: ({isActive}) => ({textDecoration:"none",color:isActive?"#111":"#555",fontWeight:isActive?"700":"500"})
};
