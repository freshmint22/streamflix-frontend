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
// Nota: añadimos http://localhost:5174 como origen por defecto para desarrollo local
// (el frontend Vite usa 5173 o 5174 dependiendo de la configuración). En producción
// usa la variable de entorno CORS_ORIGIN para listar dominios explícitos.
const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:5174")
  .split(",")
  .map((s) => s.trim());

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // allow requests with no origin (e.g., curl, server-to-server)
    if (!origin) {
      console.log('[CORS] no origin (server or curl) - allow');
      return callback(null, true);
    }

    // support wildcard '*' in CORS_ORIGIN to allow any origin (use carefully)
    if (corsOrigins.includes('*')) {
      console.log('[CORS] wildcard * configured - allow origin=', origin);
      return callback(null, true);
    }

    // normalize origin casing before comparison
    const normalized = origin.toLowerCase();
    const allowed = corsOrigins.some((o) => o.toLowerCase() === normalized);

    console.log('[CORS] origin=', origin, 'allowed=', allowed, 'allowedList=', corsOrigins);
    if (allowed) return callback(null, true);
    // Deny the origin without throwing an exception - return false so cors middleware
    // will not set Access-Control-Allow-Origin. Throwing an Error here causes the
    // request to error out before CORS headers are applied (observed as no header).
    console.warn('[CORS] denying origin=', origin);
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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
  if (!token) {
    // In production, require token. In development allow a mock user so UI flows
    // (profile, edit) can be tested without a real login flow.
    if (process.env.NODE_ENV === 'production') return res.status(401).json({ error: 'Unauthorized' });
    console.warn('[AUTH] no token provided — attaching mock dev user');
    (req as any).userId = 'dev_mock_user';
    return next();
  }
  if (isTokenBlacklisted(token)) return res.status(401).json({ error: 'Token revoked' });
  try {
    const payload = jwt.verify(token, secret) as any;
    (req as any).userId = payload?.sub || payload?.id;
    return next();
  } catch (err) {
    // Log a truncated token and the verification error to help debugging (do not log full token in production)
    try {
      const t = token || '';
      const preview = t.length > 10 ? `${t.slice(0, 6)}...${t.slice(-4)}` : t;
      console.error('[AUTH] token verify failed preview=', preview, 'error=', (err as any)?.message || err);
    } catch (e) { /* ignore logging errors */ }
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

// --- Rutas principales ---
app.use('/api/auth', authRouter);        // ✅ para register, login, logout
app.use('/api/password', passwordRouter); // ✅ para forgot-password, reset-password
app.use('/api/users', userRouter);
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
