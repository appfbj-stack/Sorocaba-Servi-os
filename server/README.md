# Kairós Serviços — Backend (Fase 1)

API REST em Node + Express + TypeScript + Drizzle ORM + Postgres 16 + MinIO.

## Stack

| Camada | Tech |
|---|---|
| Runtime | Node 22 |
| HTTP | Express 4 |
| DB | Postgres 16 |
| ORM | Drizzle ORM |
| Storage | MinIO (S3-compatible) |
| Auth | JWT (cookie httpOnly) + bcrypt |
| Validação | Zod |
| Logs | Pino |

## Estrutura

```
server/
├── src/
│   ├── server.ts          # entry Express + /health
│   ├── db/
│   │   ├── schema.ts      # schema Drizzle completo (10 tabelas)
│   │   ├── client.ts      # pool Postgres + instância drizzle
│   │   ├── migrate.ts     # CLI: aplica migrations
│   │   └── seed.ts        # CLI: popula admin + Sorocaba + categorias + settings
│   ├── services/
│   │   └── storage.ts     # wrapper S3 (MinIO)
│   └── lib/
│       └── logger.ts      # Pino
├── drizzle.config.ts
├── Dockerfile             # multi-stage node:22-alpine
└── package.json
```

## Setup local (Docker Compose recomendado)

### 1. Subir Postgres + MinIO

```bash
# Postgres
docker run -d --name kairos-servicos-pg-local \
  -e POSTGRES_USER=kairos_servicos \
  -e POSTGRES_PASSWORD=localpass \
  -e POSTGRES_DB=kairos_servicos \
  -p 5432:5432 \
  postgres:16-alpine

# MinIO (storage)
docker run -d --name kairos-servicos-minio-local \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin123 \
  -p 9000:9000 -p 9001:9001 \
  -v kairos-servicos-minio-data:/data \
  minio/minio:latest server /data --console-address ":9001"

# Criar bucket
docker run --rm --network host minio/mc:latest \
  mc alias set local http://localhost:9000 minioadmin minioadmin123 && \
  mc mb --ignore-existing local/kairos-servicos-images && \
  mc anonymous set download local/kairos-servicos-images
```

Console do MinIO: <http://localhost:9001> (login `minioadmin` / `minioadmin123`)

### 2. Configurar .env

```bash
cp .env.example .env
# Editar DATABASE_URL, JWT_SECRET (use: openssl rand -hex 48)
```

### 3. Instalar + migrar + seedar

```bash
cd server
npm install
npm run db:migrate    # aplica migrations do ./drizzle
npm run db:seed       # cria admin + Sorocaba + 30 bairros + 12 categorias + settings
```

### 4. Subir API

```bash
npm run dev           # tsx watch (hot-reload)
# ou
npm run build && npm start
```

API em `http://localhost:3051`.
Console MinIO em `http://localhost:9001`.

## Endpoints (Fase 1)

| Método | Path | Descrição |
|---|---|---|
| GET | `/` | Identifica o serviço |
| GET | `/health` | Health check (Postgres + MinIO) |

## Próximas fases

- **Fase 2**: Auth (register, login, /me) + Users
- **Fase 3**: Cities, Categories, Listings
- **Fase 4**: ServiceRequests + Proposals
- **Fase 5**: PIX + Admin + Settings editor
- **Fase 6**: Front trocar `storage.ts` por `services/api.ts`

## Deploy (VPS Dokploy)

```bash
# Na VPS
docker network create kairos-servicos-net 2>/dev/null || true
docker volume create kairos-servicos-pg-data 2>/dev/null || true
docker volume create kairos-servicos-minio-data 2>/dev/null || true

# .env no host (/root/kairos-servicos/.env)
KAIROS_SERVICOS_DB_PASS=$(openssl rand -hex 24)
KAIROS_SERVICOS_JWT_SECRET=$(openssl rand -hex 48)
KAIROS_SERVICOS_MINIO_ROOT_USER=kairos
KAIROS_SERVICOS_MINIO_ROOT_PASSWORD=$(openssl rand -hex 24)
KAIROS_SERVICOS_MINIO_BUCKET=kairos-servicos-images
KAIROS_SERVICOS_MINIO_PUBLIC_URL=https://servicos.fbautomacao.space/uploads
PIX_KEY=02598018796
PIX_KEY_TYPE=cpf

cd /etc/dokploy/compose/kairos-servicos
docker compose -p kairos-servicos -f docker-compose.prod.yml up -d
```

Caddy (no host):

```caddy
servicos.fbautomacao.space {
    reverse_proxy /api/* 127.0.0.1:3051
    reverse_proxy /uploads/* 127.0.0.1:9000
    reverse_proxy 127.0.0.1:3052
}
```
