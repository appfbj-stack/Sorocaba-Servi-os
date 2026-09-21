/**
 * Kairós Serviços — schema do banco (Drizzle ORM / Postgres 16)
 *
 * Tabelas (10):
 *   cities · neighborhoods · service_categories · users
 *   listings (unificado: profissional autônomo + empresa)
 *   service_requests · service_proposals
 *   pix_transactions · reviews · settings · audit_logs
 */

import { sql } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  text,
  varchar,
  boolean,
  integer,
  numeric,
  timestamp,
  jsonb,
  pgEnum,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// ============================================================
// Enums
// ============================================================

export const userRoleEnum = pgEnum('user_role', [
  'cliente',
  'profissional',
  'empresa',
  'admin',
]);

export const listingTypeEnum = pgEnum('listing_type', [
  'profissional', // autônomo (eletricista, diarista, etc)
  'empresa',      // CNPJ (loja, salão, oficina)
]);

export const statusEnum = pgEnum('listing_status', [
  'pendente',
  'ativo',
  'bloqueado',
]);

export const planTypeEnum = pgEnum('plan_type', [
  'gratuito_6_meses',
  'profissional',
  'pacote_10_creditos',
]);

export const planStatusEnum = pgEnum('plan_status', [
  'ativo',
  'expirado',
  'aviso_vencimento',
]);

export const requestStatusEnum = pgEnum('request_status', [
  'aberto',
  'recebido',
  'em_negociacao',
  'agendado',
  'concluido',
  'cancelado',
]);

export const proposalStatusEnum = pgEnum('proposal_status', [
  'enviado',
  'aceito',
  'recusado',
  'cancelado',
]);

export const pixTxStatusEnum = pgEnum('pix_tx_status', [
  'pendente',
  'concluido',
  'expirado',
]);

export const pixTxTypeEnum = pgEnum('pix_tx_type', [
  'recarga_creditos',
  'mensalidade_lojista',
]);

export const reviewTargetEnum = pgEnum('review_target', [
  'listing',
]);

export const auditTypeEnum = pgEnum('audit_type', [
  'seguranca',
  'aprovacao',
  'bloqueio',
  'pedido',
  'pagamento',
  'configuracao',
]);

// ============================================================
// Geografia
// ============================================================

export const cities = pgTable(
  'cities',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    nome: varchar('nome', { length: 120 }).notNull(),
    estado: varchar('estado', { length: 2 }).notNull(), // UF: SP, RJ, etc
    slug: varchar('slug', { length: 120 }),
    ativo: boolean('ativo').notNull().default(true),
    cidadePrincipal: boolean('cidade_principal').notNull().default(false),
    criadoEm: timestamp('criado_em', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugIdx: uniqueIndex('cities_slug_idx').on(t.slug),
    estadoIdx: index('cities_estado_idx').on(t.estado),
  }),
);

export const neighborhoods = pgTable(
  'neighborhoods',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    cityId: uuid('city_id').notNull().references(() => cities.id, { onDelete: 'cascade' }),
    nome: varchar('nome', { length: 120 }).notNull(),
    principal: boolean('principal').notNull().default(false),
  },
  (t) => ({
    cityIdx: index('neighborhoods_city_idx').on(t.cityId),
    uniqueCityNome: uniqueIndex('neighborhoods_city_nome_idx').on(t.cityId, t.nome),
  }),
);

// ============================================================
// Categorias
// ============================================================

export const serviceCategories = pgTable(
  'service_categories',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    nome: varchar('nome', { length: 120 }).notNull(),
    slug: varchar('slug', { length: 120 }).notNull(),
    icone: varchar('icone', { length: 80 }).notNull(), // nome do lucide-react
    descricao: text('descricao').notNull(),
    popular: boolean('popular').notNull().default(false),
    servicosPadrao: jsonb('servicos_padrao').$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    ativo: boolean('ativo').notNull().default(true),
    criadoEm: timestamp('criado_em', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugIdx: uniqueIndex('service_categories_slug_idx').on(t.slug),
  }),
);

// ============================================================
// Usuários
// ============================================================

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    nome: varchar('nome', { length: 200 }).notNull(),
    email: varchar('email', { length: 200 }).notNull(),
    passwordHash: text('password_hash').notNull(),
    telefone: varchar('telefone', { length: 20 }),
    role: userRoleEnum('role').notNull().default('cliente'),
    cityId: uuid('city_id').references(() => cities.id, { onDelete: 'set null' }),
    neighborhoodId: uuid('neighborhood_id').references(() => neighborhoods.id, { onDelete: 'set null' }),
    avatarUrl: text('avatar_url'),
    ativo: boolean('ativo').notNull().default(true),
    criadoEm: timestamp('criado_em', { withTimezone: true }).notNull().defaultNow(),
    atualizadoEm: timestamp('atualizado_em', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    emailIdx: uniqueIndex('users_email_idx').on(t.email),
    roleIdx: index('users_role_idx').on(t.role),
    cityIdx: index('users_city_idx').on(t.cityId),
  }),
);

// ============================================================
// Listings (unificado: profissional autônomo + empresa)
// ============================================================

export const listings = pgTable(
  'listings',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    tipo: listingTypeEnum('tipo').notNull(),
    categoryId: uuid('category_id').notNull().references(() => serviceCategories.id, { onDelete: 'restrict' }),

    // Apresentação
    nome: varchar('nome', { length: 200 }).notNull(),
    imagemUrl: text('imagem_url'), // 1 só (logo ou foto)
    descricao: text('descricao'),

    // Contato
    whatsapp: varchar('whatsapp', { length: 20 }).notNull(),
    telefone: varchar('telefone', { length: 20 }),
    emailPublico: varchar('email_publico', { length: 200 }),

    // Localização
    cityId: uuid('city_id').notNull().references(() => cities.id, { onDelete: 'restrict' }),
    neighborhoodId: uuid('neighborhood_id').references(() => neighborhoods.id, { onDelete: 'set null' }),
    endereco: text('endereco'),
    latitude: numeric('latitude', { precision: 10, scale: 7 }),
    longitude: numeric('longitude', { precision: 10, scale: 7 }),

    // Extras opcionais
    site: text('site'),
    instagram: varchar('instagram', { length: 80 }),

    // Serviços / produtos
    servicos: jsonb('servicos').$type<string[]>().notNull().default(sql`'[]'::jsonb`),

    // Status + moderação
    status: statusEnum('status').notNull().default('pendente'),
    motivoStatus: text('motivo_status'), // motivo do bloqueio se houver

    // Profissional autônomo — sistema de créditos
    creditos: integer('creditos').notNull().default(0),
    creditosExpiraEm: timestamp('creditos_expira_em', { withTimezone: true }),
    planoAtual: planTypeEnum('plano_atual'),
    planoStatus: planStatusEnum('plano_status'),

    // Empresa — destaque pago
    anuncioAtivo: boolean('anuncio_ativo').notNull().default(false), // true = pago destaque
    anuncioExpiraEm: timestamp('anuncio_expira_em', { withTimezone: true }),

    // Métricas denormalizadas (recalculadas por trigger/job)
    visualizacoes: integer('visualizacoes').notNull().default(0),
    cliquesWhatsapp: integer('cliques_whatsapp').notNull().default(0),
    cliquesTelefone: integer('cliques_telefone').notNull().default(0),

    criadoEm: timestamp('criado_em', { withTimezone: true }).notNull().defaultNow(),
    atualizadoEm: timestamp('atualizado_em', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: uniqueIndex('listings_user_idx').on(t.userId),
    typeCityCatIdx: index('listings_type_city_cat_idx').on(t.tipo, t.cityId, t.categoryId),
    statusIdx: index('listings_status_idx').on(t.status),
    anuncioIdx: index('listings_anuncio_idx').on(t.anuncioAtivo, t.criadoEm),
  }),
);

// ============================================================
// Pedidos de serviço (cliente → profissionais)
// ============================================================

export const serviceRequests = pgTable(
  'service_requests',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    clienteId: uuid('cliente_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    clienteNome: varchar('cliente_nome', { length: 200 }).notNull(),
    clienteWhatsapp: varchar('cliente_whatsapp', { length: 20 }).notNull(),

    categoryId: uuid('category_id').notNull().references(() => serviceCategories.id, { onDelete: 'restrict' }),
    servico: varchar('servico', { length: 200 }).notNull(),
    descricao: text('descricao').notNull(),

    cityId: uuid('city_id').notNull().references(() => cities.id, { onDelete: 'restrict' }),
    neighborhoodId: uuid('neighborhood_id').references(() => neighborhoods.id, { onDelete: 'set null' }),

    dataDesejada: timestamp('data_desejada', { withTimezone: true }),
    urgencia: varchar('urgencia', { length: 20 }).notNull().default('normal'), // baixa|normal|alta|urgente

    status: requestStatusEnum('status').notNull().default('aberto'),
    profissionalEscolhidoId: uuid('profissional_escolhido_id').references(() => listings.id, { onDelete: 'set null' }),

    criadoEm: timestamp('criado_em', { withTimezone: true }).notNull().defaultNow(),
    atualizadoEm: timestamp('atualizado_em', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    statusCityCatIdx: index('requests_status_city_cat_idx').on(t.status, t.cityId, t.categoryId),
    clienteIdx: index('requests_cliente_idx').on(t.clienteId),
  }),
);

// ============================================================
// Propostas (profissional capta um pedido, gastando 1 crédito)
// ============================================================

export const serviceProposals = pgTable(
  'service_proposals',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    requestId: uuid('request_id').notNull().references(() => serviceRequests.id, { onDelete: 'cascade' }),
    listingId: uuid('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),

    valorEstimado: numeric('valor_estimado', { precision: 12, scale: 2 }),
    prazoEstimado: varchar('prazo_estimado', { length: 120 }),
    mensagem: text('mensagem'),

    status: proposalStatusEnum('status').notNull().default('enviado'),
    creditoConsumido: boolean('credito_consumido').notNull().default(false),

    criadoEm: timestamp('criado_em', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    reqIdx: index('proposals_request_idx').on(t.requestId),
    listingIdx: index('proposals_listing_idx').on(t.listingId),
    uniquePerListing: uniqueIndex('proposals_unique_listing_request_idx').on(t.requestId, t.listingId),
  }),
);

// ============================================================
// Transações PIX
// ============================================================

export const pixTransactions = pgTable(
  'pix_transactions',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    txid: varchar('txid', { length: 80 }).notNull(), // id único do PIX gerado pelo app
    tipo: pixTxTypeEnum('tipo').notNull(),

    // Quem está pagando
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    listingId: uuid('listing_id').references(() => listings.id, { onDelete: 'set null' }),

    valor: numeric('valor', { precision: 12, scale: 2 }).notNull(),
    chavePix: varchar('chave_pix', { length: 200 }).notNull(), // snapshot da chave no momento
    descricao: varchar('descricao', { length: 200 }).notNull(),
    payload: text('payload').notNull(), // BR Code copia-e-cola
    qrcodeImage: text('qrcode_image'), // base64 PNG (opcional)

    // O que libera
    creditosLiberados: integer('creditos_liberados').notNull().default(0),
    mesesLiberados: integer('meses_liberados').notNull().default(0),

    status: pixTxStatusEnum('status').notNull().default('pendente'),
    expiraEm: timestamp('expira_em', { withTimezone: true }).notNull(),
    pagoEm: timestamp('pago_em', { withTimezone: true }),

    criadoEm: timestamp('criado_em', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    txidIdx: uniqueIndex('pix_txid_idx').on(t.txid),
    userIdx: index('pix_user_idx').on(t.userId),
    statusIdx: index('pix_status_idx').on(t.status, t.expiraEm),
  }),
);

// ============================================================
// Reviews (opcional, habilitado depois)
// ============================================================

export const reviews = pgTable(
  'reviews',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    requestId: uuid('request_id').references(() => serviceRequests.id, { onDelete: 'set null' }),
    targetType: reviewTargetEnum('target_type').notNull().default('listing'),
    listingId: uuid('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
    clienteId: uuid('cliente_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    clienteNome: varchar('cliente_nome', { length: 200 }).notNull(),
    nota: integer('nota').notNull(), // 1-5 (validado em zod)
    comentario: text('comentario'),
    criadoEm: timestamp('criado_em', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    listingIdx: index('reviews_listing_idx').on(t.listingId),
    notaIdx: index('reviews_nota_idx').on(t.nota),
  }),
);

// ============================================================
// Settings (key-value — config editável pelo admin)
// ============================================================

export const settings = pgTable('settings', {
  key: varchar('key', { length: 80 }).primaryKey(),
  value: jsonb('value').notNull(),
  descricao: text('descricao'),
  atualizadoEm: timestamp('atualizado_em', { withTimezone: true }).notNull().defaultNow(),
  atualizadoPor: uuid('atualizado_por').references(() => users.id, { onDelete: 'set null' }),
});

// ============================================================
// Audit log
// ============================================================

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    tipo: auditTypeEnum('tipo').notNull(),
    acao: varchar('acao', { length: 200 }).notNull(),
    usuarioId: uuid('usuario_id').references(() => users.id, { onDelete: 'set null' }),
    usuarioNome: varchar('usuario_nome', { length: 200 }),
    detalhes: jsonb('detalhes'),
    ip: varchar('ip', { length: 64 }),
    criadoEm: timestamp('criado_em', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    tipoIdx: index('audit_tipo_idx').on(t.tipo, t.criadoEm),
    usuarioIdx: index('audit_usuario_idx').on(t.usuarioId),
  }),
);

// ============================================================
// Type exports pra uso nos services
// ============================================================

export type City = typeof cities.$inferSelect;
export type NewCity = typeof cities.$inferInsert;
export type Neighborhood = typeof neighborhoods.$inferSelect;
export type ServiceCategory = typeof serviceCategories.$inferSelect;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Listing = typeof listings.$inferSelect;
export type NewListing = typeof listings.$inferInsert;
export type ServiceRequest = typeof serviceRequests.$inferSelect;
export type ServiceProposal = typeof serviceProposals.$inferSelect;
export type PixTransaction = typeof pixTransactions.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Setting = typeof settings.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
