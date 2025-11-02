# WCAG 2.1 guidelines implemented

The StreamFlix frontend addresses at least one success criterion across each of the four WCAG principles. File paths are relative to `src/` unless noted.

1. **Perceivable** – Components such as `components/Player.tsx`, `components/Comments.tsx`, and forms in `pages/Register.tsx` provide descriptive labels, aria-live regions, and colour contrast that keep information perceivable for screen reader users.
2. **Operable** – Keyboard navigation is supported through focusable controls, Escape shortcuts, and button semantics in `components/Navbar.tsx`, `components/Player.tsx`, and `components/Modal.tsx` (if present), ensuring all interactions are accessible without a mouse.
3. **Understandable** – Inline validation messages in `pages/Login.tsx`, `pages/Register.tsx`, and `pages/ResetPassword.tsx` use clear language and predictable layouts so that users understand the outcome of their actions.
4. **Robust** – Semantic HTML elements, proper form controls, and consistent ARIA roles in `components/Footer.tsx`, `pages/Home.tsx`, and the generated markup allow assistive technologies and automated tools to reliably parse the interface. The app passes automated checks executed with Lighthouse and axe DevTools during QA.

Developers should continue to evaluate the experience with manual audits and tooling to catch regressions as new features land.
