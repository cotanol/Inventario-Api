# --- BUILDER ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# --- PRODUCTION ---
FROM node:20-alpine
WORKDIR /app

# Instalar dependencias (incluye prisma CLI para migraciones)
COPY package*.json ./
RUN npm ci --include=dev

ENV NODE_ENV=production

# Copiar artefactos necesarios desde el builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/fonts ./fonts
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/src/assets ./src/assets

EXPOSE 4000

# Ejecutar migraciones y luego iniciar la aplicación
CMD ["sh", "-c", "npm run migration:deploy && npm run start:prod"]
