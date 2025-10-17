
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import movieRouter from './routes/movie.routes';
import playbackRouter from './routes/playback.routes';
import jwt from 'jsonwebtoken';
import { isTokenBlacklisted } from './lib/tokenBlacklist';

const app = express();

// CORS: permite localhost y tu Vercel
const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // allow requests with no origin (e.g., curl, server-to-server)
    if (!origin) return callback(null, true);
    if (corsOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions as any));

// NOTE: cors middleware will handle OPTIONS preflight automatically.
// Avoid registering a literal '*' route here because some path-to-regexp
// versions throw when parsing a bare '*' pattern.

app.use(express.json());

// Security headers
app.use(helmet());

// Basic rate limiting
const limiter = rateLimit({ windowMs: 1000 * 60, max: 300 });
app.use(limiter);

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
// Playback endpoints
app.use('/api/playback', playbackRouter);

// Swagger UI (serve openapi.yaml if present)
try{
  const doc = YAML.load(path.join(__dirname, '..', 'openapi.yaml'));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(doc));
}catch(err){ /* ignore if not present */ }

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
