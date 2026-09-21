/**
 * Rotas admin:
 *   GET  /admin/dashboard
 *   GET  /admin/listings?status=pendente
 *   PATCH /admin/listings/:id/status
 *   GET  /admin/users
 *   PATCH /admin/users/:id/status
 *   GET  /admin/pix/pending
 *   PATCH /admin/pix/:id/confirm
 *   GET  /admin/audit-logs
 */

import { Router, type Request, type Response } from 'express';
import { eq, and, desc, sql, ne } from 'drizzle-orm';
import { db } from '../db/client.ts';
import { users, listings, pixTransactions, auditLogs, serviceRequests } from '../db/schema.ts';
import { asyncHandler, HttpError } from '../middleware/error.ts';
import { requireAuth, requireRole } from '../middleware/auth.ts';
import { adminUpdateListingStatusSchema } from '../lib/validators.ts';
import { logger } from '../lib/logger.ts';

const router = Router();

router.use(requireAuth, requireRole('admin'));

/** Helper pra registrar audit log */
async function audit(tipo: typeof auditLogs.$inferInsert.tipo, acao: string, detalhes: unknown, user: typeof users.$inferSelect) {
  await db.insert(auditLogs).values({
    tipo,
    acao,
    usuarioId: user.id,
    usuarioNome: user.nome,
    detalhes: detalhes as never,
    ip: undefined,
  });
}

/** GET /admin/dashboard — métricas gerais */
router.get(
  '/dashboard',
  asyncHandler(async (_req: Request, res: Response) => {
    const [
      [{ count: usersTotal }],
      [{ count: listingsAtivos }],
      [{ count: listingsPendentes }],
      [{ count: requestsAbertos }],
      [{ count: requestsConcluidos }],
      [{ count: pixPendentes }],
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(users),
      db.select({ count: sql<number>`count(*)::int` }).from(listings).where(eq(listings.status, 'ativo')),
      db.select({ count: sql<number>`count(*)::int` }).from(listings).where(eq(listings.status, 'pendente')),
      db.select({ count: sql<number>`count(*)::int` }).from(serviceRequests).where(eq(serviceRequests.status, 'aberto')),
      db.select({ count: sql<number>`count(*)::int` }).from(serviceRequests).where(eq(serviceRequests.status, 'concluido')),
      db.select({ count: sql<number>`count(*)::int` }).from(pixTransactions).where(eq(pixTransactions.status, 'pendente')),
    ]);

    return res.json({
      dashboard: {
        usersTotal,
        listingsAtivos,
        listingsPendentes,
        requestsAbertos,
        requestsConcluidos,
        pixPendentes,
      },
    });
  }),
);

/** GET /admin/listings?status=pendente */
router.get(
  '/listings',
  asyncHandler(async (req: Request, res: Response) => {
    const status = (req.query.status as string) ?? 'pendente';
    const rows = await db
      .select()
      .from(listings)
      .where(eq(listings.status, status as 'pendente' | 'ativo' | 'bloqueado'))
      .orderBy(desc(listings.criadoEm))
      .limit(100);
    return res.json({ listings: rows });
  }),
);

/** PATCH /admin/listings/:id/status */
router.patch(
  '/listings/:id/status',
  asyncHandler(async (req: Request, res: Response) => {
    const { status, motivo } = adminUpdateListingStatusSchema.parse(req.body);

    const [existing] = await db.select().from(listings).where(eq(listings.id, req.params.id!)).limit(1);
    if (!existing) throw new HttpError(404, 'not_found');

    const [updated] = await db.update(listings)
      .set({
        status,
        motivoStatus: motivo ?? null,
        atualizadoEm: new Date(),
      })
      .where(eq(listings.id, req.params.id!))
      .returning();

    await audit(
      status === 'ativo' ? 'aprovacao' : status === 'bloqueado' ? 'bloqueio' : 'aprovacao',
      `listing ${status}`,
      { listingId: existing.id, nome: existing.nome, motivo },
      req.user!,
    );

    return res.json({ listing: updated });
  }),
);

/** GET /admin/users */
router.get(
  '/users',
  asyncHandler(async (_req: Request, res: Response) => {
    const rows = await db.select().from(users).orderBy(desc(users.criadoEm)).limit(200);
    return res.json({ users: rows });
  }),
);

/** PATCH /admin/users/:id/status */
router.patch(
  '/users/:id/status',
  asyncHandler(async (req: Request, res: Response) => {
    const { ativo } = req.body as { ativo: boolean };

    const [updated] = await db.update(users)
      .set({ ativo, atualizadoEm: new Date() })
      .where(eq(users.id, req.params.id!))
      .returning();

    if (!updated) throw new HttpError(404, 'not_found');

    await audit(
      'seguranca',
      `user ${ativo ? 'ativado' : 'desativado'}`,
      { userId: updated.id, email: updated.email },
      req.user!,
    );

    return res.json({ user: updated });
  }),
);

/** GET /admin/pix/pending — transações PIX aguardando confirmação */
router.get(
  '/pix/pending',
  asyncHandler(async (_req: Request, res: Response) => {
    const rows = await db
      .select()
      .from(pixTransactions)
      .where(eq(pixTransactions.status, 'pendente'))
      .orderBy(desc(pixTransactions.criadoEm));
    return res.json({ transactions: rows });
  }),
);

/** PATCH /admin/pix/:id/confirm — admin confirma pagamento manual */
router.patch(
  '/pix/:id/confirm',
  asyncHandler(async (req: Request, res: Response) => {
    const [tx] = await db.select().from(pixTransactions).where(eq(pixTransactions.id, req.params.id!)).limit(1);
    if (!tx) throw new HttpError(404, 'not_found');
    if (tx.status !== 'pendente') {
      throw new HttpError(400, 'already_processed', `Transação já está '${tx.status}'`);
    }

    await db.transaction(async (dbTx) => {
      // Marca transação como concluída
      await dbTx.update(pixTransactions)
        .set({ status: 'concluido', pagoEm: new Date() })
        .where(eq(pixTransactions.id, tx.id));

      // Libera créditos/anuncio no listing
      if (tx.listingId) {
        if (tx.creditosLiberados > 0) {
          await dbTx.update(listings)
            .set({
              creditos: sql`${listings.creditos} + ${tx.creditosLiberados}`,
              creditosExpiraEm: sql`now() + interval '90 days'`,
            })
            .where(eq(listings.id, tx.listingId));
        }
        if (tx.mesesLiberados > 0) {
          await dbTx.update(listings)
            .set({
              anuncioAtivo: true,
              anuncioExpiraEm: sql`now() + (interval '1 month' * ${tx.mesesLiberados})`,
            })
            .where(eq(listings.id, tx.listingId));
        }
      }
    });

    await audit(
      'pagamento',
      'pix confirmado',
      { txid: tx.txid, valor: tx.valor, tipo: tx.tipo },
      req.user!,
    );

    logger.info({ txid: tx.txid, valor: tx.valor }, 'PIX confirmado pelo admin');

    return res.json({ ok: true, message: 'Pagamento confirmado, créditos/anuncio liberados' });
  }),
);

/** GET /admin/audit-logs */
router.get(
  '/audit-logs',
  asyncHandler(async (req: Request, res: Response) => {
    const limit = Math.min(Number(req.query.limit ?? 50), 200);
    const rows = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.criadoEm))
      .limit(limit);
    return res.json({ logs: rows });
  }),
);

export default router;
