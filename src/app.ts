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
import passwordRouter from './routes/password.routes'; // ✅ nombre corregido
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

// --- Rutas principales ---
app.use('/auth', authRouter);
app.use('/api/auth', passwordRouter); // ✅ montado correctamente
app.use('/users', userRouter);
app.use('/api/movies', movieRouter);
app.use('/api/playback', playbackRouter);

// Swagger UI (serve openapi.yaml if present)
try {
  const doc = YAML.load(path.join(__dirname, '..', 'openapi.yaml'));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(doc));
} catch (err) {
  /* ignore if not present */
}

export default app;
