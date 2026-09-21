/**
 * Kairós Serviços — API entry point
 *
 * Fase 1: esqueleto mínimo com /health e middlewares base.
 * Rotas virão nas próximas fases.
 */

import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import pinoHttp from 'pino-http';
import { logger } from './lib/logger.ts';
import { pool } from './db/client.ts';
import { s3, BUCKET } from './services/storage.ts';

const PORT = Number(process.env.PORT ?? 3051);
const NODE_ENV = process.env.NODE_ENV ?? 'development';

const app = express();

// ===== Middlewares globais =====
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(pinoHttp({ logger }));

// ===== Health check =====
app.get('/health', async (_req: Request, res: Response) => {
  const checks = {
    db: { ok: false, error: undefined as string | undefined },
    storage: { ok: false, error: undefined as string | undefined },
  };

  // Postgres
  try {
    const { rows } = await pool.query('SELECT now() AS now, version() AS pg_version');
    checks.db = {
      ok: true,
      error: undefined,
      ...(rows[0] as { now?: string; pg_version?: string }),
    };
  } catch (err) {
    checks.db = { ok: false, error: String(err) };
  }

  // MinIO/S3
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
    version: '0.1.0',
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
    version: '0.1.0',
    docs: '/health',
  });
});

// ===== 404 =====
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'not_found', path: req.path });
});

// ===== Error handler global =====
app.use((err: Error, _req: Request, res: Response, _next: express.NextFunction) => {
  logger.error({ err }, 'erro não tratado');
  res.status(500).json({ error: 'internal_error', message: err.message });
});

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
