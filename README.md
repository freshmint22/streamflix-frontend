# StreamFlix frontend

Vite + React + TypeScript + SASS application that powers the StreamFlix streaming experience. The frontend consumes the StreamFlix backend (Render) using native `fetch` calls and ships complete functionality for Sprints 1–3: authentication, movie discovery, favorites, ratings, comments, and subtitle toggling.

## Live deployment

- Vercel URL: `https://streamflix.vercel.app` (update if the deployment URL changes).
- Backend API: `https://streamflix-backend.onrender.com` (configured via `VITE_API_URL`).

## Features

- Responsive layout with landing page, about page, sitemap, and persistent navbar/footer.
- Authentication flows (register, login, logout, forgot/reset password) with JWT stored in `localStorage`.
- Profile management, including edit and account deletion.
- Movie browsing, trailer playback with ES/EN subtitles, and playback progress tracking.
- Favorites, star ratings (1–5), and live comment feed per movie.
- Accessibility coverage: 10 Nielsen heuristics, 4 WCAG principles, keyboard navigation, and status messaging.

## Getting started

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:5173`. Ensure the backend is available locally or configure the Render base URL in the environment file described below.

## Environment variables

Create `./.env.local` with the following keys:

```
VITE_API_URL=https://streamflix-backend.onrender.com/api
VITE_TMDB_API_KEY=<tmdb_api_key_optional>
```

Restart the dev server after modifying env values.

## Scripts

- `npm run dev` – start Vite in development mode.
- `npm run build` – generate the production build.
- `npm run preview` – preview the production build locally.
- `npm run lint` – run ESLint using the project ruleset.

## Testing and QA

- Manual smoke tests documented in `docs/user-manual.md` and the Sprint 3 QA report (see Taiga).
- Accessibility verified with Lighthouse (Desktop/Mobile) and axe DevTools scans.

## Project structure highlights

- `src/components` – reusable UI blocks (Navbar, Player, StarRating, Comments, etc.).
- `src/pages` – route-level views (Home, Trailer, Profile, Auth flows).
- `src/services` – fetch-based API clients (movies, users, favorites, ratings, comments).
- `src/styles` – global SASS variables and helper classes.
- `docs/` – sprint plan, usability evidence, WCAG mapping, and user manual.

## Deployment

CI builds on Vercel via GitHub integration. Pushes to `main` trigger preview deployments; tagged releases (e.g. `sprint-3-release`) promote to production. Ensure the following build settings:

- Install command: `npm install`
- Build command: `npm run build`
- Output: `dist`
- Environment: define `VITE_API_URL` and optional `VITE_TMDB_API_KEY`

## Contributing

Follow the Git workflow: feature branches per teammate, small commits, pull requests into `develop`, and final merge to `main` with release tags. Document changes in Taiga stories and attach evidence (screenshots, test videos) before closing Sprint tasks.
