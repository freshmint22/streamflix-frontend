export default function MovieCard({ title, year, poster }) {
  return (
    <div style={styles.card}>
      <div style={{...styles.poster, backgroundImage:`url(${poster})`}} />
      <div style={styles.info}>
        <strong>{title}</strong>
        <span style={{color:"#777"}}>{year}</span>
      </div>
      <button style={styles.btn}>Ver detalle</button>
    </div>
  );
}

const styles = {
  card:{border:"1px solid #eee", borderRadius:12, overflow:"hidden", display:"flex", flexDirection:"column"},
  poster:{height:180, backgroundSize:"cover", backgroundPosition:"center"},
  info:{display:"flex", justifyContent:"space-between", padding:"10px 12px", alignItems:"center"},
  btn:{margin:12, padding:"8px 10px", border:"none", borderRadius:8, background:"#111", color:"#fff", cursor:"pointer"}
};
