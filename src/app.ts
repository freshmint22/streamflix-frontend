
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

app.use(cors({ origin: corsOrigins, credentials: true }));
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
// NOTE: User routes are mounted from `user.routes` and are protected there with requireAuth
// NOTE: Frontend assets are maintained in a separate project. Movie REST endpoints are exposed under /api/movies
  

export default app;
