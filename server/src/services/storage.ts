/**
 * Wrapper S3-compatible pra MinIO (e qualquer S3 real no futuro).
 *
 * Usa AWS SDK v3 — funciona com MinIO sem mudar nada.
 * Quando migrar pra R2/S3 real, só troca o endpoint.
 */

import 'dotenv/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuid } from 'uuid';
import { logger } from '../lib/logger.ts';

const required = ['S3_ENDPOINT', 'S3_BUCKET', 'S3_ACCESS_KEY', 'S3_SECRET_KEY'] as const;
for (const k of required) {
  if (!process.env[k]) {
    throw new Error(`Variável ${k} não definida no .env`);
  }
}

export const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT!,
  region: process.env.S3_REGION ?? 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true, // MinIO precisa disso
});

export const BUCKET = process.env.S3_BUCKET!;
const PUBLIC_URL = process.env.S3_PUBLIC_URL?.replace(/\/$/, '');

/**
 * Pastas lógicas dentro do bucket.
 * Use pra organizar: listings/{uuid}.jpg, avatars/{uuid}.jpg, etc.
 */
export const FOLDERS = {
  listings: 'listings',
  avatars: 'avatars',
  requests: 'requests',
} as const;

export type Folder = keyof typeof FOLDERS;

/**
 * Detecta extensão a partir do content-type.
 */
function extFromMime(mime: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'application/pdf': 'pdf',
  };
  return map[mime.toLowerCase()] ?? 'bin';
}

export interface UploadInput {
  folder: Folder;
  contentType: string;
  buffer: Buffer;
  /** nome original do arquivo (opcional, só pra log) */
  originalName?: string;
}

/**
 * Sobe um arquivo pro MinIO/S3.
 * Retorna a URL pública pra salvar no banco.
 *
 *   const url = await uploadFile({
 *     folder: 'listings',
 *     contentType: 'image/jpeg',
 *     buffer: <Buffer da imagem>,
 *   });
 *   // url = "https://servicos.fbautomacao.space/uploads/listings/abc123.jpg"
 */
export async function uploadFile(input: UploadInput): Promise<string> {
  const ext = extFromMime(input.contentType);
  const key = `${FOLDERS[input.folder]}/${uuid()}.${ext}`;

  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: input.buffer,
    ContentType: input.contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  }));

  const publicUrl = PUBLIC_URL
    ? `${PUBLIC_URL}/${key}`
    : `${process.env.S3_ENDPOINT}/${BUCKET}/${key}`;

  logger.info({ key, publicUrl }, 'arquivo enviado pro storage');
  return publicUrl;
}

/**
 * Deleta um arquivo a partir da URL pública (ou key direta).
 */
export async function deleteFile(urlOrKey: string): Promise<void> {
  const key = urlOrKey.startsWith('http')
    ? urlOrKey.split(`${BUCKET}/`)[1] ?? urlOrKey.split('/').slice(-2).join('/')
    : urlOrKey.replace(/^\//, '');

  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
  logger.info({ key }, 'arquivo deletado do storage');
}

/**
 * Verifica se um arquivo existe.
 */
export async function fileExists(key: string): Promise<boolean> {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

/**
 * Gera URL assinada (temporária) pra acesso privado.
 * Útil pra arquivos sensíveis (comprovantes, contratos).
 * Default: 1 hora.
 */
export async function signedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
  return getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
    { expiresIn: expiresInSeconds },
  );
}
