/**
 * Rotas de configurações:
 *   GET  /api/settings/public        (qualquer — só chaves públicas)
 *   GET  /api/admin/settings         (admin — todas)
 *   PATCH /api/admin/settings        (admin — atualiza uma chave por vez)
 *   POST /api/admin/settings/bulk    (admin — atualiza várias de uma vez)
 */

import { Router, type Request, type Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/client.ts';
import { settings, auditLogs } from '../db/schema.ts';
import { asyncHandler, HttpError } from '../middleware/error.ts';
import { requireAuth, requireRole } from '../middleware/auth.ts';
import { updateSettingSchema, settingsKeys } from '../lib/validators.ts';
import { logger } from '../lib/logger.ts';

const router = Router();

const PUBLIC_KEYS = new Set([
  'monetization_enabled',
  'promo_text',
  'promo_active',
  'pix_key',
  'pix_key_type',
]);

/** GET /settings/public — chaves públicas (sem auth) */
router.get(
  '/public',
  asyncHandler(async (_req: Request, res: Response) => {
    const rows = await db.select().from(settings);
    const map: Record<string, unknown> = {};
    for (const r of rows) {
      if (PUBLIC_KEYS.has(r.key)) map[r.key] = r.value;
    }
    return res.json({ settings: map });
  }),
);

/** GET /admin/settings — todas as settings (admin) */
router.get(
  '/admin/settings',
  requireAuth,
  requireRole('admin'),
  asyncHandler(async (_req: Request, res: Response) => {
    const rows = await db.select().from(settings);
    const map: Record<string, { value: unknown; descricao: string | null; atualizadoEm: Date }> = {};
    for (const r of rows) {
      map[r.key] = { value: r.value, descricao: r.descricao, atualizadoEm: r.atualizadoEm };
    }
    return res.json({ settings: map });
  }),
);

/** PATCH /admin/settings — atualiza uma chave */
router.patch(
  '/admin/settings',
  requireAuth,
  requireRole('admin'),
  asyncHandler(async (req: Request, res: Response) => {
    const { key, value } = updateSettingSchema.parse(req.body);

    if (!(settingsKeys as readonly string[]).includes(key)) {
      throw new HttpError(400, 'invalid_key', `Chave '${key}' não é editável`);
    }

    const [updated] = await db.update(settings)
      .set({ value: value as never, atualizadoEm: new Date(), atualizadoPor: req.user!.id })
      .where(eq(settings.key, key))
      .returning();

    if (!updated) throw new HttpError(404, 'not_found');

    await db.insert(auditLogs).values({
      tipo: 'configuracao',
      acao: `setting ${key} atualizado`,
      usuarioId: req.user!.id,
      usuarioNome: req.user!.nome,
      detalhes: { key, value },
    });

    logger.info({ key, adminId: req.user!.id }, 'setting atualizada');

    return res.json({ setting: updated });
  }),
);

/** POST /admin/settings/bulk — atualiza várias */
router.post(
  '/admin/settings/bulk',
  requireAuth,
  requireRole('admin'),
  asyncHandler(async (req: Request, res: Response) => {
    const updates = req.body as Record<string, unknown>;
    if (typeof updates !== 'object' || Array.isArray(updates)) {
      throw new HttpError(400, 'invalid_body', 'Esperado objeto { key: value, ... }');
    }

    const results: Array<{ key: string; ok: boolean; error?: string }> = [];

    for (const [key, value] of Object.entries(updates)) {
      if (!(settingsKeys as readonly string[]).includes(key)) {
        results.push({ key, ok: false, error: 'chave não editável' });
        continue;
      }

      try {
        await db.update(settings)
          .set({ value: value as never, atualizadoEm: new Date(), atualizadoPor: req.user!.id })
          .where(eq(settings.key, key));
        results.push({ key, ok: true });
      } catch (err) {
        results.push({ key, ok: false, error: String(err) });
      }
    }

    await db.insert(auditLogs).values({
      tipo: 'configuracao',
      acao: `settings bulk update (${results.filter(r => r.ok).length} ok)`,
      usuarioId: req.user!.id,
      usuarioNome: req.user!.nome,
      detalhes: { updates, results },
    });

    return res.json({ results });
  }),
);

export default router;
