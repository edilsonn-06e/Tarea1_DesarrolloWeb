# Imagen del frontend de Edi's Store (React + Vite servido por Nginx)
# Construcción: docker build -t edis-store-web:1.0.0 --build-arg APP_VERSION=1.0.0 .

# ---------- Etapa 1: compilar la aplicación React ----------
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html vite.config.js ./
COPY public ./public
COPY src ./src

ARG APP_VERSION=dev

# La API se consume en la misma URL (/api); Nginx la redirige al contenedor de la API
ENV VITE_API_URL=/api \
    VITE_APP_VERSION=${APP_VERSION}

RUN npm run build

# ---------- Etapa 2: servir los archivos estáticos ----------
FROM nginx:1.28-alpine

ARG APP_VERSION=dev

LABEL org.opencontainers.image.title="edis-store-web" \
      org.opencontainers.image.version="${APP_VERSION}" \
      org.opencontainers.image.description="Frontend React de Edi's Store (Tareas 4 y 5)"

# API_UPSTREAM y DEPLOY_SLOT se definen en docker compose según la estrategia
ENV APP_VERSION=${APP_VERSION} \
    API_UPSTREAM=api:4000 \
    DEPLOY_SLOT=default

# La imagen oficial de Nginx aplica envsubst a /etc/nginx/templates/*.template al iniciar
COPY deploy/nginx/web.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=5s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz >/dev/null || exit 1
