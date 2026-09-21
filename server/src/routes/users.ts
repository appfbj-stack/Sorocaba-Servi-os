/**
 * Rotas de usuário:
 *   GET   /users/:id
 *   PATCH /users/:id  (só o próprio user ou admin)
 */

import { Router, type Request, type Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/client.ts';
import { users } from '../db/schema.ts';
import { asyncHandler, HttpError } from '../middleware/error.ts';
import { requireAuth } from '../middleware/auth.ts';
import { updateUserSchema } from '../lib/validators.ts';

const router = Router();

/**
 * GET /users/:id
 * Público só retorna dados não-sensíveis.
 */
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const [user] = await db.select().from(users).where(eq(users.id, req.params.id!)).limit(1);
    if (!user) throw new HttpError(404, 'not_found', 'Usuário não encontrado');

    return res.json({
      user: {
        id: user.id,
        nome: user.nome,
        role: user.role,
        avatarUrl: user.avatarUrl,
        criadoEm: user.criadoEm,
        // telefone/email só pro próprio user ou admin
        ...(canSeePrivate(req, user.id) ? { telefone: user.telefone, email: user.email } : {}),
      },
    });
  }),
);

/**
 * PATCH /users/:id
 */
router.patch(
  '/:id',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    if (!canEdit(req, req.params.id!)) {
      throw new HttpError(403, 'forbidden', 'Você só pode editar seu próprio perfil');
    }

    const data = updateUserSchema.parse(req.body);
    const [updated] = await db.update(users)
      .set({ ...data, atualizadoEm: new Date() })
      .where(eq(users.id, req.params.id!))
      .returning();

    if (!updated) throw new HttpError(404, 'not_found', 'Usuário não encontrado');

    return res.json({
      user: {
        id: updated.id,
        nome: updated.nome,
        email: updated.email,
        telefone: updated.telefone,
        role: updated.role,
        cityId: updated.cityId,
        neighborhoodId: updated.neighborhoodId,
        avatarUrl: updated.avatarUrl,
      },
    });
  }),
);

function canSeePrivate(req: Request, targetId: string): boolean {
  if (!req.user) return false;
  if (req.user.role === 'admin') return true;
  return req.user.id === targetId;
}

function canEdit(req: Request, targetId: string): boolean {
  if (!req.user) return false;
  if (req.user.role === 'admin') return true;
  return req.user.id === targetId;
}

export default router;
