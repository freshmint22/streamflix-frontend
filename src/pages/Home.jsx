import MovieCard from "../components/MovieCard";

const DUMMY = [
  { id:1, title:"Inception", year:2010, poster:"https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg" },
  { id:2, title:"Interstellar", year:2014, poster:"https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg" },
  { id:3, title:"The Dark Knight", year:2008, poster:"https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg" }
];

export default function Home() {
  return (
    <div>
      <h1>Catálogo</h1>
      <div style={grid}>
        {DUMMY.map(m => <MovieCard key={m.id} {...m} />)}
      </div>
    </div>
  );
}

const grid = {display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px,1fr))", gap:16, marginTop:16};
