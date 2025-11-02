# Usability heuristics implemented

The following table documents how the StreamFlix frontend satisfies Nielsen’s ten usability heuristics. File paths are relative to `src/`.

1. **Visibility of system status** – Loading indicators and inline feedback in `pages/Home.tsx`, `pages/Login.tsx`, `pages/Register.tsx`, `components/StarRating.tsx`, and `components/Comments.tsx` keep users informed about background activity.
2. **Match between system and the real world** – Copywriting and labels match entertainment vocabulary in `components/Navbar.tsx`, `pages/Landing.tsx`, and `pages/Trailer.tsx`, mirroring how streaming platforms describe content (Play, Trailers, Favorites).
3. **User control and freedom** – Users can cancel edits or close overlays in `pages/Profile.tsx`, `components/Player.tsx`, and `components/FavoriteButton.tsx`, providing escape hatches from unintended actions.
4. **Consistency and standards** – Shared layout primitives and typographic variables in `styles/global.scss`, plus reusable cards in `components/MovieCard.tsx`, demonstrate a uniform look and behaviour across views.
5. **Error prevention** – Validation guards the registration and login forms (`pages/Register.tsx`, `pages/Login.tsx`) while the backend enforces schemas in `../streamflix-backend/src/middleware/validation.ts` to prevent bad data.
6. **Recognition rather than recall** – The navigation menu (`components/Navbar.tsx`) and footer sitemap (`components/Footer.tsx`) expose main destinations at all times, so users do not need to memorise routes.
7. **Flexibility and efficiency of use** – Keyboard shortcuts in `components/Navbar.tsx` and persisted profile data in `services/users.ts` speed up frequent tasks for experienced users.
8. **Aesthetic and minimalist design** – Responsive, content-focused cards in `pages/Home.tsx` and `pages/Trailer.tsx`, together with SASS variables in `styles/global.scss`, minimise clutter while keeping essential actions visible.
9. **Help users recognise, diagnose, and recover from errors** – Errors are written in plain language (`components/Comments.tsx`, `components/StarRating.tsx`, `pages/ResetPassword.tsx`) and provide guidance to retry.
10. **Help and documentation** – The in-app Forgot/Reset password flows (`pages/ForgotPassword.tsx`, `pages/ResetPassword.tsx`) offer step-by-step instructions, and the external `docs/user-manual.md` gives detailed walkthroughs.

Visit the referenced files to inspect the concrete implementations that support each heuristic.
