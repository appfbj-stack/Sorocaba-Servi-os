/**
 * Schemas Zod compartilhados entre rotas.
 * Centralizar aqui evita drift entre front e back.
 */

import { z } from 'zod';

export const userRoleSchema = z.enum(['cliente', 'profissional', 'empresa', 'admin']);

export const registerSchema = z.object({
  nome: z.string().min(2).max(200),
  email: z.email().max(200),
  password: z.string().min(8).max(100),
  telefone: z.string().min(8).max(20).optional(),
  role: userRoleSchema.default('cliente'),
  cityId: z.string().uuid().optional(),
  neighborhoodId: z.string().uuid().optional(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const updateUserSchema = z.object({
  nome: z.string().min(2).max(200).optional(),
  telefone: z.string().min(8).max(20).optional(),
  cityId: z.string().uuid().optional(),
  neighborhoodId: z.string().uuid().optional(),
  avatarUrl: z.url().optional(),
});

// ===== Cities / Categories / Listings =====

export const cityEstadoSchema = z.string().regex(/^[A-Z]{2}$/, 'Use sigla UF (ex: SP)');

export const listingTypeSchema = z.enum(['profissional', 'empresa']);

export const listingStatusSchema = z.enum(['pendente', 'ativo', 'bloqueado']);

export const createCitySchema = z.object({
  nome: z.string().min(2).max(120),
  estado: cityEstadoSchema,
  cidadePrincipal: z.boolean().default(false),
});

export const createNeighborhoodSchema = z.object({
  cityId: z.string().uuid(),
  nome: z.string().min(2).max(120),
  principal: z.boolean().default(false),
});

export const createCategorySchema = z.object({
  nome: z.string().min(2).max(120),
  slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/, 'Use kebab-case'),
  icone: z.string().min(2).max(80),
  descricao: z.string().min(2).max(500),
  popular: z.boolean().default(false),
  servicosPadrao: z.array(z.string()).default([]),
});

export const createListingSchema = z.object({
  tipo: listingTypeSchema,
  categoryId: z.string().uuid(),
  nome: z.string().min(2).max(200),
  descricao: z.string().max(2000).optional(),
  whatsapp: z.string().min(8).max(20),
  telefone: z.string().min(8).max(20).optional(),
  emailPublico: z.email().optional(),
  cityId: z.string().uuid(),
  neighborhoodId: z.string().uuid().optional(),
  endereco: z.string().max(300).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  site: z.url().optional(),
  instagram: z.string().max(80).optional(),
  servicos: z.array(z.string()).default([]),
});

export const updateListingSchema = createListingSchema.partial();

export const searchListingsSchema = z.object({
  tipo: listingTypeSchema.optional(),
  cityId: z.string().uuid().optional(),
  neighborhoodId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  q: z.string().max(120).optional(),         // busca textual simples
  status: listingStatusSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateCityInput = z.infer<typeof createCitySchema>;
export type CreateNeighborhoodInput = z.infer<typeof createNeighborhoodSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type SearchListingsInput = z.infer<typeof searchListingsSchema>;
