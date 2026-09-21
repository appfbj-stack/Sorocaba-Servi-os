/**
 * Rotas de listings (anúncios — profissionais autônomos + empresas):
 *   GET    /listings                    (público, com filtros)
 *   GET    /listings/mine               (do usuário logado)
 *   GET    /listings/:id                (público)
 *   POST   /listings                    (criar — requer auth)
 *   PATCH  /listings/:id                (próprio ou admin)
 *   DELETE /listings/:id                (próprio ou admin)
 *   POST   /listings/:id/imagem         (upload — próprio)
 *   DELETE /listings/:id/imagem         (próprio)
 *   POST   /listings/:id/clicks         (registrar clique WhatsApp/telefone)
 */

import { Router, type Request, type Response } from 'express';
import multer from 'multer';
import { eq, and, sql, or, ilike, desc, asc, type SQL } from 'drizzle-orm';
import { db } from '../db/client.ts';
import { listings, type Listing } from '../db/schema.ts';
import { asyncHandler, HttpError } from '../middleware/error.ts';
import { requireAuth } from '../middleware/auth.ts';
import {
  createListingSchema,
  updateListingSchema,
  searchListingsSchema,
} from '../lib/validators.ts';
import { uploadFile, deleteFile, FOLDERS } from '../services/storage.ts';
import { logger } from '../lib/logger.ts';

const router = Router();

// ===== Upload config =====
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const ok = /^image\/(jpeg|jpg|png|webp|gif)$/.test(file.mimetype);
    if (!ok) return cb(new HttpError(400, 'invalid_type', 'Apenas imagens (jpg/png/webp/gif)'));
    cb(null, true);
  },
});

// ===== GET /listings (público com filtros) =====
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const f = searchListingsSchema.parse(req.query);
    const filters: SQL[] = [];

    // Por padrão só mostra ativos (admin pode ver pendentes passando status)
    if (f.status) {
      filters.push(eq(listings.status, f.status));
    } else {
      filters.push(eq(listings.status, 'ativo'));
    }

    if (f.tipo) filters.push(eq(listings.tipo, f.tipo));
    if (f.cityId) filters.push(eq(listings.cityId, f.cityId));
    if (f.neighborhoodId) filters.push(eq(listings.neighborhoodId, f.neighborhoodId));
    if (f.categoryId) filters.push(eq(listings.categoryId, f.categoryId));

    if (f.q) {
      const q = `%${f.q}%`;
      filters.push(or(
        ilike(listings.nome, q),
        ilike(listings.descricao, q),
      )!);
    }

    // Ordenação: patrocinadas primeiro, depois mais recentes
    const rows = await db
      .select()
      .from(listings)
      .where(and(...filters))
      .orderBy(desc(listings.anuncioAtivo), desc(listings.criadoEm))
      .limit(f.limit)
      .offset(f.offset);

    return res.json({
      listings: rows,
      pagination: { limit: f.limit, offset: f.offset, count: rows.length },
    });
  }),
);

// ===== GET /listings/mine =====
router.get(
  '/mine',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const rows = await db
      .select()
      .from(listings)
      .where(eq(listings.userId, req.user!.id))
      .orderBy(desc(listings.criadoEm));
    return res.json({ listings: rows });
  }),
);

// ===== GET /listings/:id =====
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const [row] = await db.select().from(listings).where(eq(listings.id, req.params.id!)).limit(1);
    if (!row) throw new HttpError(404, 'not_found', 'Anúncio não encontrado');

    // Incrementa visualização (fire-and-forget)
    db.update(listings)
      .set({ visualizacoes: sql`${listings.visualizacoes} + 1` })
      .where(eq(listings.id, row.id))
      .catch((err) => logger.warn({ err }, 'falha ao incrementar visualização'));

    return res.json({ listing: row });
  }),
);

// ===== POST /listings =====
router.post(
  '/',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    if (!['profissional', 'empresa'].includes(req.user!.role)) {
      throw new HttpError(403, 'forbidden', 'Apenas profissional ou empresa pode criar anúncio');
    }

    const data = createListingSchema.parse(req.body);

    const [created] = await db.insert(listings).values({
      ...data,
      userId: req.user!.id,
      tipo: req.user!.role as 'profissional' | 'empresa',
      status: 'pendente', // admin aprova
    }).returning();

    return res.status(201).json({ listing: created });
  }),
);

// ===== PATCH /listings/:id =====
router.patch(
  '/:id',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const data = updateListingSchema.parse(req.body);

    const [existing] = await db.select().from(listings).where(eq(listings.id, req.params.id!)).limit(1);
    if (!existing) throw new HttpError(404, 'not_found', 'Anúncio não encontrado');

    if (existing.userId !== req.user!.id && req.user!.role !== 'admin') {
      throw new HttpError(403, 'forbidden', 'Você só pode editar seu próprio anúncio');
    }

    const [updated] = await db.update(listings)
      .set({ ...data, atualizadoEm: new Date() })
      .where(eq(listings.id, req.params.id!))
      .returning();

    return res.json({ listing: updated });
  }),
);

// ===== DELETE /listings/:id =====
router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const [existing] = await db.select().from(listings).where(eq(listings.id, req.params.id!)).limit(1);
    if (!existing) throw new HttpError(404, 'not_found', 'Anúncio não encontrado');

    if (existing.userId !== req.user!.id && req.user!.role !== 'admin') {
      throw new HttpError(403, 'forbidden', 'Você só pode deletar seu próprio anúncio');
    }

    // Deleta imagem do MinIO (se houver)
    if (existing.imagemUrl) {
      deleteFile(existing.imagemUrl).catch((err) =>
        logger.warn({ err, listingId: existing.id }, 'falha ao deletar imagem'));
    }

    await db.delete(listings).where(eq(listings.id, req.params.id!));
    return res.json({ ok: true });
  }),
);

// ===== POST /listings/:id/imagem (upload) =====
router.post(
  '/:id/imagem',
  requireAuth,
  upload.single('imagem'),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw new HttpError(400, 'no_file', 'Arquivo não enviado');

    const [existing] = await db.select().from(listings).where(eq(listings.id, req.params.id!)).limit(1);
    if (!existing) throw new HttpError(404, 'not_found', 'Anúncio não encontrado');

    if (existing.userId !== req.user!.id && req.user!.role !== 'admin') {
      throw new HttpError(403, 'forbidden');
    }

    // Deletar imagem antiga antes de subir a nova
    if (existing.imagemUrl) {
      deleteFile(existing.imagemUrl).catch(() => undefined);
    }

    const url = await uploadFile({
      folder: FOLDERS.listings,
      contentType: req.file.mimetype,
      buffer: req.file.buffer,
      originalName: req.file.originalname,
    });

    const [updated] = await db.update(listings)
      .set({ imagemUrl: url, atualizadoEm: new Date() })
      .where(eq(listings.id, req.params.id!))
      .returning();

    return res.json({ listing: updated, imagemUrl: url });
  }),
);

// ===== DELETE /listings/:id/imagem =====
router.delete(
  '/:id/imagem',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const [existing] = await db.select().from(listings).where(eq(listings.id, req.params.id!)).limit(1);
    if (!existing) throw new HttpError(404, 'not_found');
    if (existing.userId !== req.user!.id && req.user!.role !== 'admin') {
      throw new HttpError(403, 'forbidden');
    }

    if (existing.imagemUrl) {
      await deleteFile(existing.imagemUrl).catch(() => undefined);
    }

    const [updated] = await db.update(listings)
      .set({ imagemUrl: null, atualizadoEm: new Date() })
      .where(eq(listings.id, req.params.id!))
      .returning();

    return res.json({ listing: updated });
  }),
);

// ===== POST /listings/:id/click (tracking de clique WhatsApp/telefone) =====
router.post(
  '/:id/click',
  asyncHandler(async (req: Request, res: Response) => {
    const tipo = (req.body?.tipo as string) ?? 'whatsapp';
    if (!['whatsapp', 'telefone'].includes(tipo)) {
      throw new HttpError(400, 'invalid_tipo', 'tipo deve ser whatsapp ou telefone');
    }

    const field = tipo === 'whatsapp' ? listings.cliquesWhatsapp : listings.cliquesTelefone;

    await db.update(listings)
      .set({ [field.name]: sql`${field} + 1` })
      .where(eq(listings.id, req.params.id!));

    return res.json({ ok: true });
  }),
);

export default router;
