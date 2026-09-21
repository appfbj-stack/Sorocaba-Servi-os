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

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
