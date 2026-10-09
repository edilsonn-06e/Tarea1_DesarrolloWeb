
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// POST /api/auth/register
export async function register(req, res) {
  try {
    const { nombre, correo, password, telefono, pais } = req.body

    if (!nombre || !correo || !password) {
      return res.status(400).json({
        message: 'Nombre, correo y contraseña son obligatorios'
      })
    }

    const existe = await User.findOne({
      correo: correo.toLowerCase()
    })

    if (existe) {
      return res.status(409).json({
        message: 'Ya existe una cuenta con ese correo'
      })
    }

    // No permitir que el usuario elija el rol admin
    const user = await User.create({
      nombre,
      correo,
      password,
      telefono,
      pais
    })

    return res.status(201).json({
      message: 'Usuario registrado',
      user
    })

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Ya existe una cuenta con ese correo'
      })
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: error.message
      })
    }

    return res.status(500).json({
      message: 'Error en el servidor'
    })
  }
}

// POST /api/auth/login
export async function login(req, res) {
  try {
    const { correo, password } = req.body

    if (!correo || !password) {
      return res.status(400).json({
        message: 'Correo y contraseña son obligatorios'
      })
    }

    const user = await User.findOne({
      correo: correo.toLowerCase()
    })

    // Verificar credenciales
    if (!user || !(await user.compararPassword(password))) {
      return res.status(401).json({
        message: 'Correo o contraseña incorrectos'
      })
    }

    // Comprobar que existe la clave secreta
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: 'Falta configurar JWT_SECRET en el servidor'
      })
    }

    // Generar token JWT válido durante 2 horas
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      {
        expiresIn: '2h',
        algorithm: 'HS256'
      }
    )

    // Devolver datos del usuario y su token
    return res.json({
      message: 'Inicio de sesión exitoso',
      user,
      token
    })

  } catch (error) {
    console.error('Error en login:', error.message)

    return res.status(500).json({
      message: 'Error en el servidor'
    })
  }
}
