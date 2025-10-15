
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from 'path';
import authRouter from './routes/auth.routes';

const app = express();

// CORS: permite localhost y tu Vercel
const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(express.json());

// Servir archivos estáticos desde carpeta `public`
app.use(express.static(path.join(process.cwd(), 'public')));

// Ruta de prueba
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", message: "Servidor funcionando correctamente" });
});

// --- Mock auth middleware (acepta cualquier token "devtoken") ---
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (token === "devtoken") return next();
  return res.status(401).json({ error: "Unauthorized (mock)" });
}

// --- Auth routes (real implementation) ---
app.use('/auth', authRouter);

// --- Users: Get profile (MOCK, protegido) ---
app.get("/users/me", requireAuth, (_req: Request, res: Response) => {
  // En real: leer usuario del token/JWT
  return res.json({
    _id: "u_mock",
    firstName: "Anderson",
    lastName: "Demo",
    age: 20,
    email: "anderson@example.com",
    createdAt: "2025-10-01",
  });
});

// --- Users: Update profile (MOCK, protegido) ---
app.put("/users/me", requireAuth, (req: Request, res: Response) => {
  const { firstName, lastName, age, email } = (req.body || {}) as {
    firstName?: string;
    lastName?: string;
    age?: number;
    email?: string;
  };
  return res.json({
    _id: "u_mock",
    firstName: firstName || "Anderson",
    lastName: lastName || "Demo",
    age: Number.isFinite(age) ? (age as number) : 20,
    email: email || "anderson@example.com",
    updatedAt: new Date().toISOString(),
  });
});

// --- Users: Delete account (MOCK, protegido) ---
app.delete("/users/me", requireAuth, (_req: Request, res: Response) => {
  return res.json({ message: "Account deleted (mock)" });
});
// --- Movies (MOCK) ---
app.get("/movies", (_req: Request, res: Response) => {
  res.json([
    { id: "1", title: "The Sample", year: 2024, posterUrl: "" },
    { id: "2", title: "Mock Returns", year: 2023, posterUrl: "" },
    { id: "3", title: "Hello, World!", year: 2022, posterUrl: "" },
  ]);
});
  

export default app;
