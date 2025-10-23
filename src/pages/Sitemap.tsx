/**
 * Sitemap page - visual list of main routes for users and crawlers.
 */
export default function Sitemap() {
  const routes = ["/", "/home", "/about", "/login", "/register", "/profile", "/favorites", "/sitemap"];
  return (
    <div style={{ maxWidth: 900, margin: "10px auto" }}>
      <h1>Sitemap</h1>
      <ul>
        {routes.map((r) => (
          <li key={r}><a href={r}>{r}</a></li>
        ))}
      </ul>
    </div>
  );
}
