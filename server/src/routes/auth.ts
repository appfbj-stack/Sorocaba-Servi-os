/**
 * Rotas de autenticação:
 *   POST /auth/register
 *   POST /auth/login
 *   POST /auth/logout
 *   GET  /auth/me
 */

import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '../db/client.ts';
import { users, listings } from '../db/schema.ts';
import { COOKIE_NAME, COOKIE_OPTIONS, signToken } from '../lib/jwt.ts';
import { loginSchema, registerSchema } from '../lib/validators.ts';
import { asyncHandler, HttpError } from '../middleware/error.ts';
import { requireAuth } from '../middleware/auth.ts';
import { logger } from '../lib/logger.ts';

const router = Router();

/**
 * POST /auth/register
 * Cria usuário (default role=cliente).
 * Se for 'profissional' ou 'empresa', cria listing pendente em paralelo.
 */
router.post(
  '/register',
  asyncHandler(async (req: Request, res: Response) => {
    const data = registerSchema.parse(req.body);

    const exists = await db.select({ id: users.id }).from(users).where(eq(users.email, data.email)).limit(1);
    if (exists.length > 0) {
      throw new HttpError(409, 'email_in_use', 'Este email já está cadastrado');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const [user] = await db.insert(users).values({
      nome: data.nome,
      email: data.email,
      passwordHash,
      telefone: data.telefone,
      role: data.role,
      cityId: data.cityId,
      neighborhoodId: data.neighborhoodId,
    }).returning();

    if (!user) {
      throw new Error('Falha ao inserir usuário');
    }

    // Se for anunciante (profissional/empresa), cria listing pendente.
    // O cadastro do listing em si é separado (Fase 3) — aqui só deixa a estrutura pronta.
    if (data.role === 'profissional' || data.role === 'empresa') {
      const freeCredits = 10; // virá de settings na Fase 5
      await db.insert(listings).values({
        userId: user.id,
        tipo: data.role,
        nome: data.nome,
        whatsapp: data.telefone ?? '',
        categoryId: undefined as never, // usuário completa depois
        cityId: data.cityId ?? undefined as never,
        status: 'pendente',
        creditos: freeCredits,
      }).catch((err) => logger.warn({ err }, 'listing seed falhou — usuário deve completar depois'));
    }

    const token = signToken({ sub: user.id, email: user.email, role: user.role });
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    return res.status(201).json({
      user: publicUser(user),
      token, // também no body pra SPA usar em localStorage se quiser
    });
  }),
);

/**
 * POST /auth/login
 */
router.post(
  '/login',
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = loginSchema.parse(req.body);

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user || !user.ativo) {
      throw new HttpError(401, 'invalid_credentials', 'Email ou senha incorretos');
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new HttpError(401, 'invalid_credentials', 'Email ou senha incorretos');
    }

    const token = signToken({ sub: user.id, email: user.email, role: user.role });
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    return res.json({ user: publicUser(user), token });
  }),
);

/**
 * POST /auth/logout
 */
router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  return res.json({ ok: true });
});

/**
 * GET /auth/me
 */
router.get('/me', requireAuth, (req: Request, res: Response) => {
  return res.json({ user: publicUser(req.user!) });
});

function publicUser(u: typeof users.$inferSelect) {
  return {
    id: u.id,
    nome: u.nome,
    email: u.email,
    telefone: u.telefone,
    role: u.role,
    cityId: u.cityId,
    neighborhoodId: u.neighborhoodId,
    avatarUrl: u.avatarUrl,
    criadoEm: u.criadoEm,
  };
}

export default router;
