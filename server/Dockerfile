# ===== Kairós Serviços API =====
# Roda via tsx direto (sem step de build separado — evita problemas de TS emit)

FROM node:22-alpine AS base
RUN apk add --no-cache openssl
WORKDIR /app

# ---- runtime ----
FROM base AS runtime
ENV NODE_ENV=production
COPY package.json package.json
COPY tsconfig.json tsconfig.json
COPY drizzle.config.ts drizzle.config.ts
COPY src src

# Instala deps com tsx incluso (não precisa buildar)
RUN npm install --no-audit --no-fund --legacy-peer-deps

# Cria pasta pra migrations geradas
RUN mkdir -p drizzle

EXPOSE 3051
USER node
CMD ["npx", "tsx", "src/server.ts"]
