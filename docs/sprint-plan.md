# Sprint 2 & 3 implementation plan

## Sprint 2 recap – Discovery and playback

- _Goal_: let authenticated users browse, play, and curate movies.
- _Delivered features_:
	- Navigation shell (Navbar, Footer, Sitemap) and responsive landing page.
	- Movie catalogue with playback modal, pause/stop tracking, and subtitle hooks.
	- Account flows: register, login, logout, password recovery, profile edit and delete.
	- Favorites API integration with optimistic updates and list management.
	- Initial accessibility uplift (6 heuristics, 2 WCAG success criteria) and fetch-based data layer.
- _Outstanding follow-up_: refine documentation and prepare formal usability testing scripts.

## Sprint 3 scope – Ratings, comments, subtitles

- _Goal_: complete the community layer and polish compliance artefacts.
- _Committed backlog items_:
	1. Implement movie ratings CRUD, aggregate stats, and UI widgets.
	2. Publish authenticated comments feed per movie with moderation safeguards.
	3. Enable bilingual subtitle toggle within the video player.
	4. Expand accessibility documentation to cover all 10 heuristics and 4 WCAG principles.
	5. Publish a user manual with onboarding and troubleshooting steps.
	6. Validate deployments (Render + Vercel) and capture QA evidence (test video + report).
- _Done criteria_:
	- API endpoints available and protected with JWT.
	- Frontend consumes endpoints via `fetch` only and respects Vite environment variables.
	- App responsive across breakpoints (≤360px, 768px, ≥1280px) with SASS styling.
	- Documentation updated (README, heuristics, WCAG, sprint notes, user manual).
	- Regression smoke tests recorded and shared with the team.

## Timeline and owners

| Task | Owner | Due |
| --- | --- | --- |
| Ratings & comments backend | Backend squad | Week 1 |
| Ratings/comments UI + subtitles toggle | Frontend squad | Week 1 |
| Accessibility + documentation | UX writer | Week 2 |
| Manual & QA assets | QA lead | Week 2 |

Weekly checkpoints on Mondays and Thursdays verify deployment health and unblock any integration issues.