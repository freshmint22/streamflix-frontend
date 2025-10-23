# Usability heuristics implemented

This document maps six usability heuristics to concrete places in the project.

1. Visibility of system status
   - Evidence: Loading indicators and messages in `src/pages/Home.tsx`, `src/pages/Login.tsx`, `src/pages/Register.tsx` and `src/pages/Profile.tsx`.

2. Match between system and the real world
   - Evidence: Labels and terminology in forms and navigation (e.g. `Navbar.tsx`, `Register.tsx`) match user expectations.

3. User control and freedom
   - Evidence: Edit forms include Cancel buttons in `src/pages/Profile.tsx` and `Register.tsx` allows navigation to Login.

4. Consistency and standards
   - Evidence: Routes and components follow consistent naming and structure (`src/routes/AppRoutes.tsx`, `src/components/*`).

5. Error prevention and help
   - Evidence: Client-side validation in `Register.tsx` and `Login.tsx`; backend validation in controllers and model schemas.

6. Accessibility for keyboard and assistive tech
   - Evidence: Keyboard handlers in `src/components/Navbar.tsx` (Enter/Escape), ARIA attributes in `Player.tsx` and `Profile.tsx`.

For each of these entries, open the referenced file to see concrete code examples and comments.
