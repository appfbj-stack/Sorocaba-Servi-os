# ===== Kairós Serviços API =====
# Multi-stage build pra imagem final leve

FROM node:22-alpine AS base
RUN apk add --no-cache openssl
WORKDIR /app

# ---- deps stage ----
FROM base AS deps
COPY package.json package.json
# Se tivesse lockfile separado pra server (pnpm/bun):
# COPY package.json ./
RUN npm install --omit=dev

# ---- build stage ----
FROM base AS build
COPY package.json package.json
RUN npm install
COPY tsconfig.json tsconfig.json
COPY drizzle.config.ts drizzle.config.ts
COPY src src
RUN npm run build

# ---- runtime stage ----
FROM base AS runtime
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/drizzle ./drizzle
COPY package.json package.json

EXPOSE 3051
USER node
CMD ["node", "dist/server.js"]
