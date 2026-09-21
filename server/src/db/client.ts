/**
 * Conexão Postgres via node-postgres + Drizzle ORM.
 * Pool gerenciado — não cria uma conexão por request.
 */

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL não definida no .env');
}

export const pool = new Pool({
  connectionString: databaseUrl,
  max: 20, // ajuste conforme carga
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('[pg] erro inesperado no pool:', err);
});

export const db = drizzle(pool, { schema });

export type DB = typeof db;
