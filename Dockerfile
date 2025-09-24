# Stage 1: build
FROM node:18 AS build

WORKDIR /app

# Copiar package json e instalar deps
COPY package*.json ./
RUN npm ci

# Copiar código y compilar
COPY . .
RUN npm run build

# Stage 2: producción
FROM node:18-slim

ENV NODE_ENV=production
WORKDIR /app

# Copiar package.json y solo instalar prod deps
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev

# Copiar build
COPY --from=build /app/dist ./dist

EXPOSE 8005

CMD ["node", "dist/index.js"]
