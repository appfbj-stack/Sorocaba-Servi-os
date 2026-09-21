/**
 * Rotas de categorias de serviço:
 *   GET  /categories        (público)
 *   GET  /categories/:id    (público)
 *   POST /categories        (admin)
 */

import { Router, type Request, type Response } from 'express';
import { eq, asc } from 'drizzle-orm';
import { db } from '../db/client.ts';
import { serviceCategories } from '../db/schema.ts';
import { asyncHandler, HttpError } from '../middleware/error.ts';
import { requireAuth, requireRole } from '../middleware/auth.ts';
import { createCategorySchema } from '../lib/validators.ts';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const rows = await db
      .select()
      .from(serviceCategories)
      .where(eq(serviceCategories.ativo, true))
      .orderBy(asc(serviceCategories.nome));
    return res.json({ categories: rows });
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const [row] = await db.select().from(serviceCategories).where(eq(serviceCategories.id, req.params.id!)).limit(1);
    if (!row) throw new HttpError(404, 'not_found', 'Categoria não encontrada');
    return res.json({ category: row });
  }),
);

router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  asyncHandler(async (req: Request, res: Response) => {
    const data = createCategorySchema.parse(req.body);
    const [created] = await db.insert(serviceCategories).values(data).returning();
    return res.status(201).json({ category: created });
  }),
);

export default router;
