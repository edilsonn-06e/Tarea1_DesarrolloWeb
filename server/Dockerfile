# Imagen de la API REST de Edi's Store (Express + Mongoose)
# Construcción: docker build -t edis-store-api:1.0.0 --build-arg APP_VERSION=1.0.0 server
FROM node:22-alpine

# Versión publicada en /api/version y en la cabecera X-App-Version
ARG APP_VERSION=dev

LABEL org.opencontainers.image.title="edis-store-api" \
      org.opencontainers.image.version="${APP_VERSION}" \
      org.opencontainers.image.description="API REST de Edi's Store (Tareas 4 y 5)"

ENV NODE_ENV=production \
    PORT=4000 \
    APP_VERSION=${APP_VERSION}

WORKDIR /app

# Instalar solo dependencias de producción (capa cacheable)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .

# No ejecutar el proceso como root
USER node

EXPOSE 4000

HEALTHCHECK --interval=5s --timeout=3s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:4000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
