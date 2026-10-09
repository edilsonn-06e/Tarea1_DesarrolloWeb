
import mongoose from 'mongoose'
import User from '../models/User.js'

// GET /api/users/:id
export async function getUserById(req, res) {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Id inválido'
      })
    }

    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      })
    }

    return res.json(user)

  } catch (error) {
    return res.status(500).json({
      message: 'Error en el servidor',
      error: error.message
    })
  }
}
