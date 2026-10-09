
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Verifica que la petición tenga un JWT válido
export async function protegerRuta(req, res, next) {
  try {
    const authorization = req.headers.authorization

    if (!authorization?.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Debes iniciar sesión para continuar'
      })
    }

    const token = authorization.split(' ')[1]

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: 'Error de configuración del servidor'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256']
    })

    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({
        message: 'El usuario ya no existe'
      })
    }

    req.user = user
    next()

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Tu sesión ha expirado'
      })
    }

    return res.status(401).json({
      message: 'Token inválido o no autorizado'
    })
  }
}

// Verifica que el usuario sea administrador
export function soloAdmin(req, res, next) {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({
      message: 'No tienes permisos de administrador'
    })
  }

  next()
}
