// Compatibility shim for Windows case-insensitive imports.
// The repo has `App.tsx` (React root) but some imports resolve to `./App` and
// on Windows the resolver may pick this `app.ts` file first. Re-export the
// default export from the real `App.tsx` so both `import App from "./App"`
// and `import App from "./App.tsx"` work consistently.
export { default } from './App.tsx';
