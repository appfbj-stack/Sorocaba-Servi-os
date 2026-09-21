/**
 * Rotas de Proposals (profissional CAPTA um pedido, gastando 1 crédito):
 *   POST /proposals                      (gasta 1 crédito, atomicamente)
 *   GET  /proposals/by-request/:id       (cliente vê as do pedido dele)
 *   GET  /proposals/mine                 (propostas do profissional logado)
 *   PATCH /proposals/:id/cancel          (profissional desiste — devolve crédito)
 *   PATCH /proposals/:id/accept          (cliente aceita — marca como escolhido)
 *   PATCH /proposals/:id/refuse          (cliente recusa)
 */

import { Router, type Request, type Response } from 'express';
import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from '../db/client.ts';
import { serviceProposals, serviceRequests, listings } from '../db/schema.ts';
import { asyncHandler, HttpError } from '../middleware/error.ts';
import { requireAuth } from '../middleware/auth.ts';
import { createProposalSchema } from '../lib/validators.ts';
import { logger } from '../lib/logger.ts';

const router = Router();

/**
 * POST /proposals — profissional capta um pedido aberto.
 * Decrementa 1 crédito atomicamente. Falha se:
 *   - listing não tem créditos
 *   - listing já fez proposta nesse pedido (unique constraint)
 *   - pedido não está 'aberto'
 *   - listing não é o próprio user
 */
router.post(
  '/',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    if (!['profissional', 'empresa'].includes(req.user!.role)) {
      throw new HttpError(403, 'forbidden', 'Apenas anunciantes podem captar pedidos');
    }

    const data = createProposalSchema.parse(req.body);

    // Pega o listing do usuário
    const [me] = await db.select().from(listings).where(eq(listings.userId, req.user!.id)).limit(1);
    if (!me) throw new HttpError(404, 'no_listing', 'Crie um anúncio primeiro');
    if (me.status !== 'ativo') throw new HttpError(403, 'listing_inactive', 'Seu anúncio não está ativo');

    // Pega o pedido
    const [request] = await db.select().from(serviceRequests).where(eq(serviceRequests.id, data.requestId)).limit(1);
    if (!request) throw new HttpError(404, 'no_request', 'Pedido não encontrado');
    if (request.status !== 'aberto') throw new HttpError(400, 'request_closed', 'Pedido não está aberto');

    // Verifica créditos
    if ((me.creditos ?? 0) < 1) {
      throw new HttpError(402, 'no_credits', 'Você não tem créditos. Compre um pacote pra captar este pedido.');
    }

    // Verifica que pediu na mesma categoria/cidade (consistência)
    if (me.categoryId !== request.categoryId || me.cityId !== request.cityId) {
      throw new HttpError(400, 'mismatch', 'Seu anúncio não cobre essa categoria/cidade');
    }

    // ===== Transação: decrementa crédito + insere proposta =====
    const result = await db.transaction(async (tx) => {
      // Decrementa crédito atomicamente (where creditos > 0 evita race)
      const decremented = await tx
        .update(listings)
        .set({ creditos: sql`${listings.creditos} - 1` })
        .where(and(eq(listings.id, me.id), sql`${listings.creditos} > 0`))
        .returning({ creditos: listings.creditos });

      if (decremented.length === 0) {
        throw new HttpError(402, 'no_credits', 'Créditos insuficientes');
      }

      // Insere proposta (unique constraint protege double-captation)
      const [proposal] = await tx.insert(serviceProposals).values({
        requestId: data.requestId,
        listingId: me.id,
        valorEstimado: data.valorEstimado?.toString(),
        prazoEstimado: data.prazoEstimado,
        mensagem: data.mensagem,
        status: 'enviado',
        creditoConsumido: true,
      }).returning();

      return proposal;
    });

    logger.info({ proposalId: result?.id, listingId: me.id, requestId: data.requestId }, 'proposta criada (1 crédito gasto)');

    return res.status(201).json({ proposal: result });
  }),
);

/** GET /proposals/by-request/:id — cliente vê propostas do pedido dele */
router.get(
  '/by-request/:id',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const [request] = await db.select().from(serviceRequests).where(eq(serviceRequests.id, req.params.id!)).limit(1);
    if (!request) throw new HttpError(404, 'no_request');

    if (request.clienteId !== req.user!.id && req.user!.role !== 'admin') {
      throw new HttpError(403, 'forbidden');
    }

    const rows = await db
      .select()
      .from(serviceProposals)
      .where(eq(serviceProposals.requestId, req.params.id!))
      .orderBy(desc(serviceProposals.criadoEm));

    return res.json({ proposals: rows });
  }),
);

/** GET /proposals/mine — propostas do profissional logado */
router.get(
  '/mine',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const [me] = await db.select().from(listings).where(eq(listings.userId, req.user!.id)).limit(1);
    if (!me) return res.json({ proposals: [] });

    const rows = await db
      .select()
      .from(serviceProposals)
      .where(eq(serviceProposals.listingId, me.id))
      .orderBy(desc(serviceProposals.criadoEm));

    return res.json({ proposals: rows });
  }),
);

/** PATCH /proposals/:id/cancel — profissional desiste (devolve crédito) */
router.patch(
  '/:id/cancel',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const [proposal] = await db.select().from(serviceProposals).where(eq(serviceProposals.id, req.params.id!)).limit(1);
    if (!proposal) throw new HttpError(404, 'not_found');

    if (proposal.listingId !== req.user!.id && req.user!.role !== 'admin') {
      throw new HttpError(403, 'forbidden');
    }

    if (proposal.status !== 'enviado') {
      throw new HttpError(400, 'cannot_cancel', `Proposta já está '${proposal.status}'`);
    }

    await db.transaction(async (tx) => {
      await tx.update(serviceProposals)
        .set({ status: 'cancelado' })
        .where(eq(serviceProposals.id, proposal.id));

      if (proposal.creditoConsumido) {
        await tx.update(listings)
          .set({ creditos: sql`${listings.creditos} + 1` })
          .where(eq(listings.id, proposal.listingId));
      }
    });

    return res.json({ ok: true, message: 'Crédito devolvido' });
  }),
);

/** PATCH /proposals/:id/accept — cliente aceita proposta */
router.patch(
  '/:id/accept',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const [proposal] = await db.select().from(serviceProposals).where(eq(serviceProposals.id, req.params.id!)).limit(1);
    if (!proposal) throw new HttpError(404, 'not_found');

    const [request] = await db.select().from(serviceRequests).where(eq(serviceRequests.id, proposal.requestId)).limit(1);
    if (!request) throw new HttpError(404, 'no_request');

    if (request.clienteId !== req.user!.id && req.user!.role !== 'admin') {
      throw new HttpError(403, 'forbidden');
    }

    if (proposal.status !== 'enviado') {
      throw new HttpError(400, 'cannot_accept', `Proposta já está '${proposal.status}'`);
    }

    await db.transaction(async (tx) => {
      // Marca proposta como aceita
      await tx.update(serviceProposals)
        .set({ status: 'aceito' })
        .where(eq(serviceProposals.id, proposal.id));

      // Marca as outras como recusadas
      await tx.update(serviceProposals)
        .set({ status: 'recusado' })
        .where(and(
          eq(serviceProposals.requestId, proposal.requestId),
          sql`${serviceProposals.id} != ${proposal.id}`,
        ));

      // Atualiza o pedido: profissional escolhido + status em_negociacao
      await tx.update(serviceRequests)
        .set({
          profissionalEscolhidoId: proposal.listingId,
          status: 'em_negociacao',
          atualizadoEm: new Date(),
        })
        .where(eq(serviceRequests.id, proposal.requestId));

      // Devolve crédito das propostas recusadas (que tinham consumido)
      const recusadas = await tx.select().from(serviceProposals)
        .where(and(
          eq(serviceProposals.requestId, proposal.requestId),
          eq(serviceProposals.status, 'recusado'),
          eq(serviceProposals.creditoConsumido, true),
        ));

      for (const r of recusadas) {
        await tx.update(listings)
          .set({ creditos: sql`${listings.creditos} + 1` })
          .where(eq(listings.id, r.listingId));
        await tx.update(serviceProposals)
          .set({ creditoConsumido: false })
          .where(eq(serviceProposals.id, r.id));
      }
    });

    return res.json({ ok: true, message: 'Proposta aceita, outras foram recusadas e créditos devolvidos' });
  }),
);

/** PATCH /proposals/:id/refuse — cliente recusa proposta (devolve crédito) */
router.patch(
  '/:id/refuse',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const [proposal] = await db.select().from(serviceProposals).where(eq(serviceProposals.id, req.params.id!)).limit(1);
    if (!proposal) throw new HttpError(404, 'not_found');

    const [request] = await db.select().from(serviceRequests).where(eq(serviceRequests.id, proposal.requestId)).limit(1);
    if (!request) throw new HttpError(404, 'no_request');

    if (request.clienteId !== req.user!.id && req.user!.role !== 'admin') {
      throw new HttpError(403, 'forbidden');
    }

    if (proposal.status !== 'enviado') {
      throw new HttpError(400, 'cannot_refuse');
    }

    await db.transaction(async (tx) => {
      await tx.update(serviceProposals)
        .set({ status: 'recusado' })
        .where(eq(serviceProposals.id, proposal.id));

      if (proposal.creditoConsumido) {
        await tx.update(listings)
          .set({ creditos: sql`${listings.creditos} + 1` })
          .where(eq(listings.id, proposal.listingId));
        await tx.update(serviceProposals)
          .set({ creditoConsumido: false })
          .where(eq(serviceProposals.id, proposal.id));
      }
    });

    return res.json({ ok: true, message: 'Proposta recusada, crédito devolvido' });
  }),
);

export default router;
