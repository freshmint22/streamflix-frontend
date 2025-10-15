import { useNavigate } from "react-router-dom";
import "./Landing.scss"; // lo creamos en el paso 4

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="land-wrap">
      {/* Header */}
      <header className="land-header">
        <div className="brand">
          <span className="logo-dot">▶</span> StreamFlix
        </div>
        <button className="btn-primary" onClick={() => navigate("/login")}>
          INGRESAR
        </button>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>
            Explora y disfruta tus películas
            <br /> favoritas en cualquier lugar
          </h1>

          {/* CTA email */}
          <div className="cta">
            <p>¿Quieres ver Streamflix ya? Ingresa tu email<br/>para crear una cuenta</p>
            <div className="cta-row">
              <input type="email" placeholder="Email" />
              <button className="btn-primary" onClick={() => navigate("/register")}>
                Regístrate y disfruta!
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="categories">
        <div className="cat-head">
          <div>
            <h2>Explora nuestras variadas<br/>categorías</h2>
            <p>
              Ya sea que busques una comedia que te haga reír, un
              drama que te haga pensar o un documental para aprender algo nuevo.
            </p>
          </div>
          <div className="carousel-ctrl">
            <button className="ctrl">{'←'}</button>
            <div className="dots">
              <span className="dot active" />
              <span className="dot" />
              <span className="dot" />
            </div>
            <button className="ctrl">{'→'}</button>
          </div>
        </div>

        <div className="cat-grid">
          {CATEGORIES.map(c => (
            <CategoryCard key={c.name} {...c} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="land-footer">
        Proyecto Integrador – 2025
      </footer>
    </div>
  );
}

// arriba del archivo
type Category = { name: string; images: string[] };

function CategoryCard({ name, images }: Category) {
  return (
    <article className="cat-card">
      <div className="cat-posters">
        {images.slice(0, 3).map((src, i) => (
          <img key={i} src={src} alt={name} loading="lazy" />
        ))}
      </div>
      <div className="cat-row">
        <span>{name}</span>
        <span>→</span>
      </div>
    </article>
  );
}

const CATEGORIES: Category[] = [{
    name: "Action",
    images: [
      "https://image.tmdb.org/t/p/w185/ceG9VZOq2zImlt0m7p7G3myCRHn.jpg",
      "https://image.tmdb.org/t/p/w185/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg",
      "https://image.tmdb.org/t/p/w185/umC04Cozevu8nn3JTDJ1pc7PVTn.jpg",
    ],
  },
  {
    name: "Adventure",
    images: [
      "https://image.tmdb.org/t/p/w185/2CAL2433ZeIihfX1Hb2139CX0pW.jpg",
      "https://image.tmdb.org/t/p/w185/9O1Iy9od7W7bRRQ6S1U9MGaI8Ds.jpg",
      "https://image.tmdb.org/t/p/w185/AbRYlvwAKHs0YuyNO6NX9ofq4l6.jpg",
    ],
  },
  {
    name: "Comedy",
    images: [
      "https://image.tmdb.org/t/p/w185/3LGr8G8Z2y1NTeWY5Avzkdxl3pE.jpg",
      "https://image.tmdb.org/t/p/w185/9gLu47Zw5ertuFTZaxXOvNfy78T.jpg",
      "https://image.tmdb.org/t/p/w185/5P8SmMzSNYikXpxil6BYzJ16611.jpg",
    ],
  },
  {
    name: "Drama",
    images: [
      "https://image.tmdb.org/t/p/w185/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg",
      "https://image.tmdb.org/t/p/w185/9Mp54LBxhiXmGOVh7LppwLo8m12.jpg",
      "https://image.tmdb.org/t/p/w185/2TeJfUZMGolfDdW6DKhfIWqvq8y.jpg",
    ],
  },
  {
    name: "Horror",
    images: [
      "https://image.tmdb.org/t/p/w185/7c9UVPPiTPltIDOA8em3bIF05fq.jpg",
      "https://image.tmdb.org/t/p/w185/eqfdZCv2xYvPQU4Z1nJQDaU29Qa.jpg",
      "https://image.tmdb.org/t/p/w185/4q2hz2m8hubgvijz8Ez0T2Os2Yv.jpg",
    ],
  },];
