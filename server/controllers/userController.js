
import mongoose from 'mongoose'
import User from '../models/User.js'

// GET /api/users/:id
export async function getUserById(req, res) {
  try {
    const { id } = req.params

    // Validar que el ID tenga un formato correcto
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Id inválido'
      })
    }

    // Buscar al usuario sin recuperar su contraseña
    const user = await User.findById(id).select('-password')

    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      })
    }

    return res.json(user)

  } catch (error) {
    console.error('Error al consultar usuario:', error.message)

    return res.status(500).json({
      message: 'Error en el servidor'
    })
  }
}
    