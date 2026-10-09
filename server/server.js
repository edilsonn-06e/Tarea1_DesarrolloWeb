
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'

const app = express()
const PORT = process.env.PORT || 4000

// Permitir las peticiones desde React
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
}))

// Permitir recibir información en formato JSON
app.use(express.json())

// Ruta para verificar que el servidor funciona
app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
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
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API escuchando en el puerto ${PORT}`)
})
