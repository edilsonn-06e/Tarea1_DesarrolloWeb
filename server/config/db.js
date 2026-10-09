
import mongoose from 'mongoose'

export async function connectDB() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error('Falta la variable MONGODB_URI en el archivo .env')
    process.exit(1)
  }

  try {
    const conn = await mongoose.connect(uri)
    console.log(`MongoDB conectado: ${conn.connection.host}`)
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message)
    process.exit(1)
  }

  // Eventos para controlar errores después de conectarse
  mongoose.connection.on('error', (err) =>
    console.error('Error de MongoDB:', err.message)
  )

  mongoose.connection.on('disconnected', () =>
    console.warn('MongoDB desconectado')
  )
}
