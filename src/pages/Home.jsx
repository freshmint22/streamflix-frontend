export default function Home() {
  return (
    <div style={styles.wrap}>
      <h1 style={{margin:0}}>Bienvenido a StreamFlix</h1>
      <p style={{color:"#666", marginTop:8}}>
        En el Sprint 2 verás aquí el catálogo de películas.
      </p>

      <div style={styles.panel}>
        <h3 style={{margin:"0 0 8px"}}>¿Qué viene?</h3>
        <ul style={{margin:0, paddingLeft:18, lineHeight:1.7}}>
          <li>Listado de películas por género</li>
          <li>Buscador y filtros</li>
          <li>Reproducción, pausa y stop</li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  wrap:{maxWidth:1000, margin:"10px auto"},
  panel:{marginTop:18, padding:16, border:"1px solid #eee", borderRadius:12, background:"#fafafa"}
};
