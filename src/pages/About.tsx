/**
 * About page component.
 * Contains information about the project, team and mission. Uses semantic sections
 * and ARIA attributes to improve accessibility.
 */
import "./About.scss";

const About = () => {
  return (
    <div className="about-wrap">
      <header className="about-header">
        <h1>Sobre nosotros</h1>
        <p className="about-lead">
          StreamFlix es una plataforma para descubrir y compartir películas mediante una
          interfaz moderna, accesible y responsiva.
        </p>
      </header>

      <section className="about-section" aria-labelledby="team">
        <h2 id="team">Equipo</h2>
        <p>
          Este proyecto fue desarrollado por estudiantes como parte de un curso de
          desarrollo full stack. El backend se implementó con Node.js, Express y MongoDB;
          el frontend con React, Vite y TypeScript.
        </p>
      </section>

      <section className="about-section" aria-labelledby="mission">
        <h2 id="mission">Misión</h2>
        <p>
          Ofrecer una experiencia centrada en el usuario: usabilidad, accesibilidad y
          consistencia en la interfaz para facilitar la exploración y gestión de contenido.
        </p>
      </section>

      <section className="about-section" aria-labelledby="contact">
        <h2 id="contact">Contacto</h2>
        <p>
          Para más información revisa el repositorio del proyecto o contacta al equipo
          por los canales del curso.
        </p>
      </section>
    </div>
  );
};

export default About;
