
import 'dotenv/config'
import os from 'node:os'
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'

const app = express()
const PORT = process.env.PORT || 4000

// Versión de la imagen y entorno de despliegue (Tarea 6: Docker)
const APP_VERSION = process.env.APP_VERSION || 'dev'
const DEPLOY_SLOT = process.env.DEPLOY_SLOT || 'local'

// Permitir las peticiones desde React
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
}))

// Permitir recibir información en formato JSON
app.use(express.json())

// Identificar en cada respuesta qué versión la atendió
app.use((_req, res, next) => {
  res.set('X-App-Version', APP_VERSION)
  res.set('X-Deploy-Slot', DEPLOY_SLOT)
  next()
})

// Ruta para verificar que el servidor funciona
app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

// Ruta para identificar la versión desplegada
app.get('/api/version', (_req, res) => {
  res.json({
    version: APP_VERSION,
    slot: DEPLOY_SLOT,
    host: os.hostname()
  })
})

// Rutas de autenticación
app.use('/api/auth', authRoutes)

// Rutas de productos
app.use('/api/recursos', productRoutes)

// Rutas de usuarios
app.use('/api/users', userRoutes)

// Ruta no encontrada
app.use((_req, res) => {
  res.status(404).json({
    message: 'Ruta no encontrada'
  })
})

// Conectar MongoDB antes de iniciar el servidor
await connectDB()

// Iniciar el servidor (compatible con Render)
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`API ${APP_VERSION} (${DEPLOY_SLOT}) escuchando en el puerto ${PORT}`)
})

// Apagado ordenado cuando Docker detiene el contenedor (docker stop envía SIGTERM)
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    console.log(`${signal} recibido: cerrando API ${APP_VERSION}`)
    server.close(() => process.exit(0))
  })
}
