/**
 * Rotas PIX (manual via BR Code):
 *   POST /pix/recharge           (gera BR Code dinâmico + cria transação pendente)
 *   GET  /pix/transactions       (histórico do user logado)
 *   GET  /pix/transactions/:id   (detalhe)
 *
 * MVP sem PSP: pagamento é confirmado manualmente pelo admin.
 * Quando integrar PSP (Mercado Pago/Pagar.me), webhook atualiza a transação.
 */

import { Router, type Request, type Response } from 'express';
import { eq, and, desc, sql } from 'drizzle-orm';
import QRCode from 'qrcode';
import { db } from '../db/client.ts';
import { pixTransactions, listings, settings } from '../db/schema.ts';
import { asyncHandler, HttpError } from '../middleware/error.ts';
import { requireAuth } from '../middleware/auth.ts';
import { createPixRechargeSchema } from '../lib/validators.ts';
import { generatePixCode } from '../lib/pix.ts';
import { logger } from '../lib/logger.ts';

const router = Router();

const PUBLIC_SETTINGS_KEYS = ['pix_key', 'pix_key_type', 'monetization_enabled'];

async function getSettingsMap(): Promise<Record<string, unknown>> {
  const rows = await db.select().from(settings);
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

/** POST /pix/recharge — gera BR Code pro user pagar */
router.post(
  '/recharge',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { tipo } = createPixRechargeSchema.parse(req.body);

    const map = await getSettingsMap();
    if (map.monetization_enabled === false) {
      throw new HttpError(403, 'monetization_disabled', 'Cobrança desabilitada pelo admin');
    }

    let valor: number;
    let descricao: string;
    let creditosLiberados = 0;
    let mesesLiberados = 0;

    if (tipo === 'recarga_creditos') {
      const packQty = Number(map.credit_pack_qty ?? 10);
      const packPrice = Number(map.credit_pack_price ?? 49.90);
      valor = packPrice;
      descricao = `Recarga ${packQty} creditos`;
      creditosLiberados = packQty;
    } else {
      // mensalidade_lojista
      valor = Number(map.lojista_price_monthly ?? 19.99);
      descricao = `Mensalidade Lojista`;
      mesesLiberados = 1;
    }

    // txid único — só alfanum, máx 25
    const txid = `KS${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 8).toUpperCase()}`.slice(0, 25);

    const chave = String(map.pix_key ?? process.env.PIX_KEY ?? '02598018796');
    const tipoChave = String(map.pix_key_type ?? 'cpf') as 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';

    const payload = generatePixCode({
      chave,
      tipoChave,
      valor,
      txid,
      merchantName: String(map.pix_merchant_name ?? process.env.PIX_MERCHANT_NAME ?? 'Kairos Servicos'),
      merchantCity: String(map.pix_merchant_city ?? process.env.PIX_MERCHANT_CITY ?? 'Sorocaba'),
      descricao,
    });

    const qrcodeDataUrl = await QRCode.toDataURL(payload, { width: 300, margin: 1 });

    const [listing] = await db.select().from(listings).where(eq(listings.userId, req.user!.id)).limit(1);

    const expiraEm = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const [created] = await db.insert(pixTransactions).values({
      txid,
      tipo,
      userId: req.user!.id,
      listingId: listing?.id,
      valor: valor.toFixed(2),
      chavePix: chave,
      descricao,
      payload,
      qrcodeImage: qrcodeDataUrl,
      creditosLiberados,
      mesesLiberados,
      expiraEm,
      status: 'pendente',
    }).returning();

    logger.info({ txid, userId: req.user!.id, tipo, valor }, 'PIX gerado');

    return res.status(201).json({
      transaction: created,
      brCode: payload,
      qrCodeImage: qrcodeDataUrl,
    });
  }),
);

/** GET /pix/transactions — histórico do user */
router.get(
  '/transactions',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const rows = await db
      .select()
      .from(pixTransactions)
      .where(eq(pixTransactions.userId, req.user!.id))
      .orderBy(desc(pixTransactions.criadoEm))
      .limit(50);

    return res.json({ transactions: rows });
  }),
);

/** GET /pix/transactions/:id */
router.get(
  '/transactions/:id',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const [row] = await db.select().from(pixTransactions).where(eq(pixTransactions.id, req.params.id!)).limit(1);
    if (!row) throw new HttpError(404, 'not_found');
    if (row.userId !== req.user!.id && req.user!.role !== 'admin') {
      throw new HttpError(403, 'forbidden');
    }
    return res.json({ transaction: row });
  }),
);

export default router;
