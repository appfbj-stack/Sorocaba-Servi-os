/**
 * Rotas de Service Requests (pedidos que o cliente cria):
 *   GET    /requests                      (admin: vê todos)
 *   GET    /requests/mine                 (cliente logado)
 *   GET    /requests/available           (anunciantes: veem o que podem captar)
 *   GET    /requests/:id
 *   POST   /requests                      (criar — qualquer user ou anônimo)
 *   PATCH  /requests/:id/status           (cliente dono / admin / profissional escolhido)
 *   DELETE /requests/:id                  (cliente dono ou admin)
 */

import { Router, type Request, type Response } from 'express';
import { eq, and, desc, ne, sql, or, ilike } from 'drizzle-orm';
import { db } from '../db/client.ts';
import { serviceRequests, users, listings } from '../db/schema.ts';
import { asyncHandler, HttpError } from '../middleware/error.ts';
import { requireAuth } from '../middleware/auth.ts';
import { createRequestSchema, updateRequestStatusSchema } from '../lib/validators.ts';
import { logger } from '../lib/logger.ts';

const router = Router();

/** GET /requests — admin vê todos, filtros opcionais */
router.get(
  '/',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    if (req.user!.role !== 'admin') {
      throw new HttpError(403, 'forbidden', 'Apenas admin lista todos');
    }

    const rows = await db
      .select()
      .from(serviceRequests)
      .orderBy(desc(serviceRequests.criadoEm))
      .limit(100);

    return res.json({ requests: rows });
  }),
);

/** GET /requests/mine — pedidos do cliente logado */
router.get(
  '/mine',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const rows = await db
      .select()
      .from(serviceRequests)
      .where(eq(serviceRequests.clienteId, req.user!.id))
      .orderBy(desc(serviceRequests.criadoEm));
    return res.json({ requests: rows });
  }),
);

/**
 * GET /requests/available
 * Pedidos abertos na mesma cidade/bairro/categoria do listing do profissional.
 * Requer login como 'profissional' ou 'empresa' com listing ativo.
 */
router.get(
  '/available',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    if (!['profissional', 'empresa'].includes(req.user!.role)) {
      throw new HttpError(403, 'forbidden', 'Apenas anunciantes veem pedidos disponíveis');
    }

    const [me] = await db.select().from(listings).where(eq(listings.userId, req.user!.id)).limit(1);
    if (!me) throw new HttpError(404, 'no_listing', 'Você precisa ter um anúncio ativo');

    const rows = await db
      .select()
      .from(serviceRequests)
      .where(and(
        eq(serviceRequests.cityId, me.cityId),
        eq(serviceRequests.status, 'aberto'),
        eq(serviceRequests.categoryId, me.categoryId),
        ne(serviceRequests.clienteId, req.user!.id),
      ))
      .orderBy(desc(serviceRequests.criadoEm))
      .limit(50);

    return res.json({ requests: rows });
  }),
);

/** GET /requests/:id */
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const [row] = await db.select().from(serviceRequests).where(eq(serviceRequests.id, req.params.id!)).limit(1);
    if (!row) throw new HttpError(404, 'not_found', 'Pedido não encontrado');

    // Privacidade: cliente vê o próprio, profissional escolhido vê, admin vê tudo
    const isOwner = req.user?.id === row.clienteId;
    const isAdmin = req.user?.role === 'admin';

    if (!isOwner && !isAdmin && row.status !== 'aberto') {
      // Pedidos só aparecem pra quem tá envolvido (ou se tá aberto pra captação)
      throw new HttpError(403, 'forbidden');
    }

    return res.json({ request: row });
  }),
);

/** POST /requests — criar pedido (logado ou anônimo) */
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const data = createRequestSchema.parse(req.body);

    let clienteId: string | null = null;
    let clienteNome = data.clienteNome ?? 'Anônimo';
    let clienteWhatsapp = data.clienteWhatsapp;

    if (req.user) {
      clienteId = req.user.id;
      clienteNome = req.user.nome;
      clienteWhatsapp = req.user.telefone ?? data.clienteWhatsapp;
    }

    const [created] = await db.insert(serviceRequests).values({
      clienteId: clienteId ?? (null as never), // será string se logado, null se anônimo (Drizzle aceita null)
      clienteNome,
      clienteWhatsapp,
      categoryId: data.categoryId,
      servico: data.servico,
      descricao: data.descricao,
      cityId: data.cityId,
      neighborhoodId: data.neighborhoodId,
      dataDesejada: data.dataDesejada ? new Date(data.dataDesejada) : null,
      urgencia: data.urgencia,
      status: 'aberto',
    }).returning();

    logger.info({ requestId: created?.id, clienteId }, 'pedido criado');

    return res.status(201).json({ request: created });
  }),
);

/** PATCH /requests/:id/status */
router.patch(
  '/:id/status',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { status } = updateRequestStatusSchema.parse(req.body);

    const [existing] = await db.select().from(serviceRequests).where(eq(serviceRequests.id, req.params.id!)).limit(1);
    if (!existing) throw new HttpError(404, 'not_found');

    const isOwner = existing.clienteId === req.user!.id;
    const isAdmin = req.user!.role === 'admin';
    const isChosen = existing.profissionalEscolhidoId === req.user!.id; // simplificado

    if (!isOwner && !isAdmin && !isChosen) {
      throw new HttpError(403, 'forbidden');
    }

    // Transições válidas (cliente controla cancelamento/conclusão)
    const validTransitions: Record<string, string[]> = {
      aberto: ['recebido', 'em_negociacao', 'cancelado'],
      recebido: ['em_negociacao', 'agendado', 'cancelado'],
      em_negociacao: ['agendado', 'cancelado'],
      agendado: ['concluido', 'cancelado'],
      concluido: [],
      cancelado: [],
    };

    if (isOwner && !validTransitions[existing.status]?.includes(status)) {
      throw new HttpError(400, 'invalid_transition', `Não pode ir de '${existing.status}' para '${status}'`);
    }

    const [updated] = await db.update(serviceRequests)
      .set({ status, atualizadoEm: new Date() })
      .where(eq(serviceRequests.id, req.params.id!))
      .returning();

    return res.json({ request: updated });
  }),
);

/** DELETE /requests/:id — cancelar (cliente) */
router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const [existing] = await db.select().from(serviceRequests).where(eq(serviceRequests.id, req.params.id!)).limit(1);
    if (!existing) throw new HttpError(404, 'not_found');

    if (existing.clienteId !== req.user!.id && req.user!.role !== 'admin') {
      throw new HttpError(403, 'forbidden');
    }

    if (['concluido', 'cancelado'].includes(existing.status)) {
      throw new HttpError(400, 'cannot_delete', 'Pedido já finalizado');
    }

    await db.update(serviceRequests)
      .set({ status: 'cancelado', atualizadoEm: new Date() })
      .where(eq(serviceRequests.id, req.params.id!));

    return res.json({ ok: true });
  }),
);

export default router;
