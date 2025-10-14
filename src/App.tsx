// src/App.tsx
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import type { CSSProperties } from "react";

function App() {
  return (
    <div style={styles.app}>
      <Navbar />
      <main style={styles.main}>
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

const styles: Record<"app" | "main", CSSProperties> = {
  app: { display: "flex", flexDirection: "column", minHeight: "100vh" },
  main: { flex: 1, background: "#f9f9f9" },
};

export default App;
