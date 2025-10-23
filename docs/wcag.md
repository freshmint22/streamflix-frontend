# WCAG guidelines implemented

This file documents two WCAG-related areas implemented in the frontend.

1) Operable — Keyboard support
   - Evidence: `src/components/Navbar.tsx` includes keyboard handling (Enter to activate brand link, Escape to close menus). `Player.tsx` exposes aria-labels and focusable controls.

2) Perceptible — Use of ARIA and readable feedback
   - Evidence: `aria-live` regions in forms and `Player.tsx` position updates, `label` elements in `Register.tsx` and `Profile.tsx`.

Notes: These implementations provide practical coverage for Operable and Perceptible principles. For full WCAG compliance run an automated scanner (axe or Lighthouse) and review contrast and alt-text coverage.
