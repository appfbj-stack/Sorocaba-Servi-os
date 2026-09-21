/**
 * Middlewares de autenticação e autorização.
 *
 *  - attachUser     : popula req.user a partir do cookie (sem bloquear)
 *  - requireAuth    : bloqueia se não tiver usuário autenticado
 *  - requireRole    : bloqueia se o role não bater
 *
 * Uso típico:
 *   app.use(attachUser);
 *   app.get('/auth/me', requireAuth, meHandler);
 *   app.delete('/admin/users/:id', requireAuth, requireRole('admin'), handler);
 */

import type { Request, Response, NextFunction } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/client.ts';
import { users, type User } from '../db/schema.ts';
import { COOKIE_NAME, verifyToken } from '../lib/jwt.ts';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

/** Lê o cookie e popula req.user se válido. NÃO bloqueia. */
export async function attachUser(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return next();

  try {
    const payload = verifyToken(token);
    const found = await db.select().from(users).where(eq(users.id, payload.sub)).limit(1);
    if (found[0] && found[0].ativo) {
      req.user = found[0];
    }
  } catch {
    // token inválido/expirado — ignora silenciosamente
  }
  next();
}

/** Bloqueia se não tiver usuário autenticado. */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'unauthorized', message: 'Faça login para continuar' });
  }
  next();
}

/** Bloqueia se o usuário não tiver um dos roles permitidos. */
export function requireRole(...roles: Array<'cliente' | 'profissional' | 'empresa' | 'admin'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'forbidden',
        message: `Acesso restrito a: ${roles.join(', ')}`,
      });
    }
    next();
  };
}
