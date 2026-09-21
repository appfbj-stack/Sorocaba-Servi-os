/**
 * Rotas de cidades + bairros:
 *   GET    /cities                       (público)
 *   GET    /cities/:id                   (público)
 *   GET    /cities/:id/neighborhoods     (público)
 *   POST   /cities                       (admin)
 *   POST   /cities/:id/neighborhoods     (admin)
 */

import { Router, type Request, type Response } from 'express';
import { eq, and, asc } from 'drizzle-orm';
import { db } from '../db/client.ts';
import { cities, neighborhoods } from '../db/schema.ts';
import { asyncHandler, HttpError } from '../middleware/error.ts';
import { requireAuth, requireRole } from '../middleware/auth.ts';
import { createCitySchema, createNeighborhoodSchema } from '../lib/validators.ts';

const router = Router();

/** GET /cities — lista todas as cidades ativas */
router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const rows = await db
      .select()
      .from(cities)
      .where(eq(cities.ativo, true))
      .orderBy(asc(cities.nome));
    return res.json({ cities: rows });
  }),
);

/** GET /cities/:id — detalhe */
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const [row] = await db.select().from(cities).where(eq(cities.id, req.params.id!)).limit(1);
    if (!row) throw new HttpError(404, 'not_found', 'Cidade não encontrada');
    return res.json({ city: row });
  }),
);

/** GET /cities/:id/neighborhoods — bairros da cidade */
router.get(
  '/:id/neighborhoods',
  asyncHandler(async (req: Request, res: Response) => {
    const rows = await db
      .select()
      .from(neighborhoods)
      .where(eq(neighborhoods.cityId, req.params.id!))
      .orderBy(asc(neighborhoods.principal), asc(neighborhoods.nome));
    return res.json({ neighborhoods: rows });
  }),
);

/** POST /cities — admin cria cidade */
router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  asyncHandler(async (req: Request, res: Response) => {
    const data = createCitySchema.parse(req.body);
    const slug = `${data.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-')}-${data.estado.toLowerCase()}`;

    const [created] = await db.insert(cities).values({
      nome: data.nome,
      estado: data.estado,
      cidadePrincipal: data.cidadePrincipal,
      slug,
    }).returning();

    return res.status(201).json({ city: created });
  }),
);

/** POST /cities/:id/neighborhoods — admin cria bairro */
router.post(
  '/:id/neighborhoods',
  requireAuth,
  requireRole('admin'),
  asyncHandler(async (req: Request, res: Response) => {
    const data = createNeighborhoodSchema.parse({
      ...req.body,
      cityId: req.params.id,
    });

    const [created] = await db.insert(neighborhoods).values({
      cityId: data.cityId,
      nome: data.nome,
      principal: data.principal,
    }).returning();

    return res.status(201).json({ neighborhood: created });
  }),
);

export default router;
