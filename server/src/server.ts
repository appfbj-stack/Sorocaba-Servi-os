/**
 * Kairós Serviços — API entry point
 *
 * Fase 2: Auth (JWT cookie) + Users. Rotas virão nas próximas fases.
 */

import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import rateLimit from 'express-rate-limit';
import { logger } from './lib/logger.ts';
import { pool } from './db/client.ts';
import { s3, BUCKET } from './services/storage.ts';
import { attachUser } from './middleware/auth.ts';
import { errorHandler } from './middleware/error.ts';
import authRouter from './routes/auth.ts';
import usersRouter from './routes/users.ts';
import citiesRouter from './routes/cities.ts';
import categoriesRouter from './routes/categories.ts';
import listingsRouter from './routes/listings.ts';
import requestsRouter from './routes/requests.ts';
import proposalsRouter from './routes/proposals.ts';

const PORT = Number(process.env.PORT ?? 3051);
const NODE_ENV = process.env.NODE_ENV ?? 'development';

const app = express();

// ===== Confiança no proxy (Caddy/Dokploy) =====
app.set('trust proxy', 1);

// ===== Middlewares globais =====
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(pinoHttp({ logger }));
app.use(attachUser);

// ===== Rate limiter global =====
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'rate_limited', message: 'Muitas requisições, tente em alguns minutos' },
});
app.use('/api', limiter);

// ===== Health check =====
app.get('/health', async (_req: Request, res: Response) => {
  const checks = {
    db: { ok: false, error: undefined as string | undefined },
    storage: { ok: false, error: undefined as string | undefined },
  };

  try {
    const { rows } = await pool.query('SELECT now() AS now, version() AS pg_version');
    const row = rows[0] as { now?: string; pg_version?: string } | undefined;
    checks.db = { ok: true, error: undefined, ...(row ?? {}) };
  } catch (err) {
    checks.db = { ok: false, error: String(err) };
  }

  try {
    const { HeadBucketCommand } = await import('@aws-sdk/client-s3');
    await s3.send(new HeadBucketCommand({ Bucket: BUCKET }));
    checks.storage = { ok: true, error: undefined };
  } catch (err) {
    checks.storage = { ok: false, error: String(err) };
  }

  const allOk = checks.db.ok && checks.storage.ok;
  return res.status(allOk ? 200 : 503).json({
    status: allOk ? 'ok' : 'degraded',
    env: NODE_ENV,
    uptime: Math.round(process.uptime()),
    service: 'kairos-servicos-api',
    version: '0.4.0',
    checks: {
      db: { ok: checks.db.ok, ...(checks.db.error ? { error: checks.db.error } : {}) },
      storage: { ok: checks.storage.ok, ...(checks.storage.error ? { error: checks.storage.error } : {}) },
    },
  });
});

// ===== Rota raiz =====
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'Kairós Serviços API',
    version: '0.4.0',
    docs: '/health',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      cities: '/api/cities',
      categories: '/api/categories',
      listings: '/api/listings',
      requests: '/api/requests',
      proposals: '/api/proposals',
    },
  });
});

// ===== Rotas da API =====
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/cities', citiesRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/listings', listingsRouter);
app.use('/api/requests', requestsRouter);
app.use('/api/proposals', proposalsRouter);

// ===== 404 =====
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'not_found', path: req.path });
});

// ===== Error handler global (deve ser o último) =====
app.use(errorHandler);

// ===== Boot =====
app.listen(PORT, () => {
  logger.info(`🚀 Kairós Serviços API rodando em http://localhost:${PORT} (${NODE_ENV})`);
});

// ===== Graceful shutdown =====
const shutdown = async (signal: string) => {
  logger.info(`sinal ${signal} recebido, fechando…`);
  await pool.end().catch(() => undefined);
  process.exit(0);
};
process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
