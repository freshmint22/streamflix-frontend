import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{textAlign:"center", marginTop:80}}>
      <h1>404</h1>
      <p>La página que buscas no existe.</p>
      <Link to="/home">Volver al inicio</Link>
    </div>
  );
}
