
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

    // El rol NO se toma del body
    // Así evitamos que cualquiera se registre como admin
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
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: error.message
      })
    }

    return res.status(500).json({
      message: 'Error en el servidor',
      error: error.message
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

    // Comprobar si el usuario existe
    // y si la contraseña es correcta
    if (!user || !(await user.compararPassword(password))) {
      return res.status(401).json({
        message: 'Correo o contraseña incorrectos'
      })
    }

    return res.json({
      message: 'Inicio de sesión exitoso',
      user
    })

  } catch (error) {
    return res.status(500).json({
      message: 'Error en el servidor',
      error: error.message
    })
  }
}
