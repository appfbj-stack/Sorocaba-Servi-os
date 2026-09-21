/**
 * Helpers JWT (HS256).
 * Token é setado como cookie httpOnly chamado "kairos_token".
 */

import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;
if (!SECRET || SECRET.length < 16) {
  throw new Error('JWT_SECRET ausente ou muito curto (mínimo 16 chars). Use: openssl rand -hex 48');
}

const EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '30d';

export interface JWTPayload {
  sub: string;     // user.id
  email: string;
  role: 'cliente' | 'profissional' | 'empresa' | 'admin';
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload as object, SECRET!, { expiresIn: EXPIRES_IN } as jwt.SignOptions);
}

export function verifyToken(token: string): JWTPayload {
  const decoded = jwt.verify(token, SECRET!) as JWTPayload;
  if (!decoded.sub) throw new Error('Token sem subject');
  return decoded;
}

export const COOKIE_NAME = 'kairos_token';

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
};
