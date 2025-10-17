
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from 'path';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import movieRouter from './routes/movie.routes';
import jwt from 'jsonwebtoken';
import { isTokenBlacklisted } from './lib/tokenBlacklist';

const app = express();

// CORS: permite localhost y tu Vercel
const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(express.json());

// Ruta de prueba
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", message: "Servidor funcionando correctamente" });
});

// --- Auth middleware: verifica JWT y añade userId a la request ---
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  if (isTokenBlacklisted(token)) return res.status(401).json({ error: 'Token revoked' });
  try {
    const payload = jwt.verify(token, secret) as any;
    (req as any).userId = payload?.sub || payload?.id;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

// --- Auth routes (real implementation) ---
app.use('/auth', authRouter);
// Mount user routes
app.use('/users', userRouter);
// Movies REST API (persistent)
app.use('/api/movies', movieRouter);

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
// NOTE: Frontend assets are maintained in a separate project. Movie REST endpoints are exposed under /api/movies
  

export default app;
