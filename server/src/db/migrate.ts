/**
 * Aplica as migrations do Drizzle no banco.
 * Roda em CI, no boot do container, ou manualmente: npm run db:migrate
 */

import 'dotenv/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool } from './client.ts';

async function main() {
  // eslint-disable-next-line no-console
  console.log('[migrate] aplicando migrations de ./drizzle');
  await migrate(db, { migrationsFolder: './drizzle' });
  // eslint-disable-next-line no-console
  console.log('[migrate] ✓ migrations aplicadas');
  await pool.end();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[migrate] ✗ falhou:', err);
  process.exit(1);
});
