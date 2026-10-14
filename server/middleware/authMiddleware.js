
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Verifica que la petición tenga un JWT válido
// en la cabecera: Authorization: Bearer <token>
export async function protegerRuta(req, res, next) {
  try {
    const authorization = req.headers.authorization

    // Sin cabecera o sin el esquema Bearer
    if (!authorization?.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'token_missing',
        message: 'Debes iniciar sesión para continuar'
      })
    }

    const token = authorization.slice('Bearer '.length).trim()

    // Cabecera presente pero sin token
    if (!token) {
      return res.status(401).json({
        error: 'token_missing',
        message: 'Debes iniciar sesión para continuar'
      })
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: 'Error de configuración del servidor'
      })
    }

    // Verificar la firma con la clave secreta del servidor
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256']
    })

    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({
        error: 'token_invalid',
        message: 'El usuario ya no existe'
      })
    }

    req.user = user
    req.tokenPayload = decoded
    next()

  } catch (error) {
    // El token superó sus 5 minutos de vigencia
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'token_expired',
        message: 'La sesión ha expirado o ya no es válida. Por favor, inicie sesión nuevamente.'
      })
    }

    return res.status(401).json({
      error: 'token_invalid',
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
