# Backend support for UX heuristics and WCAG (Sprint 1)

This document explains how the backend should support three usability heuristics and one WCAG guideline required for Sprint 1. It's intended for frontend developers implementing the Vite/React client.

1) Visibility of system status (Heuristic)
- Backend responsibilities:
  - Provide clear request status responses (HTTP 2xx/4xx/5xx) with standardized JSON error objects: { status, code, message, details? }.
  - Include progress metadata where appropriate, e.g., paginated movie lists include page, limit, total to allow UI to show loading and progress.
  - Playback endpoints (`/playback/start`, `/playback/pause`, `/playback/stop`) return the saved timestamp and state so the client can show current playback status immediately.

2) Error prevention & easy recovery (Heuristic)
- Backend responsibilities:
  - Validate inputs strictly (Joi/Zod) and return helpful, localized-friendly error messages in a consistent structure to allow client to map to inline form errors.
  - For password reset, do not reveal whether an email exists; always return a generic success message to reduce user enumeration.
  - Implement rate limiting on auth endpoints to prevent abuse; return `Retry-After` header on 429 responses so the UI can suggest retry timing.

3) Consistency & standards (Heuristic)
- Backend responsibilities:
  - Use predictable RESTful endpoints and consistent naming (e.g., `/auth/login`, `/auth/register`, `/users/me`, `/api/movies`).
  - Consistent JSON shapes for similar operations (create/update return the same resource shape as GET).
  - Use standard HTTP verbs and status codes so front-end fetch logic can be uniform.

WCAG guideline: Perceivable — Text alternatives
- Backend responsibilities enabling WCAG 1.1 (Text Alternatives):
  - Provide `posterAlt` for movie posters in the movie resource so the client can render meaningful alt text for images.
  - Ensure that media metadata (title, description, year) is returned as structured text so the client can present alternatives for visual media.

Notes for frontend implementers (Vite/React + Fetch)
- Use the OpenAPI spec `openapi.yaml` as the contract for building fetch calls.
- Use environment variables in the Vite app for the API base URL.
- Follow the standardized error format from the backend to show inline validation messages and friendly toast notifications.
