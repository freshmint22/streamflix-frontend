// src/App.tsx
import AppRoutes from "./routes/AppRoutes";
import type { CSSProperties } from "react";

export default function App() {
  return (
    <div style={styles.app}>
      <main style={styles.main}>
        <AppRoutes />
      </main>
    </div>
  );
}

const styles: Record<"app" | "main", CSSProperties> = {
  app: { display: "flex", flexDirection: "column", minHeight: "100vh" },
  main: { flex: 1, background: "var(--bg)" },
};
