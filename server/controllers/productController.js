
import mongoose from 'mongoose'
import Product from '../models/Product.js'

// GET /api/recursos
// Consultar productos con filtros
export async function getProducts(req, res) {
  try {
    const { buscar, categoria, orden } = req.query

    const filtro = {}

    if (buscar) {
      filtro.name = { $regex: buscar, $options: 'i' }
    }

    if (categoria) {
      filtro.category = categoria
    }

    let consulta = Product.find(filtro)

    if (orden === 'asc') {
      consulta = consulta.sort({ price: 1 })
    }

    if (orden === 'desc') {
      consulta = consulta.sort({ price: -1 })
    }

    const productos = await consulta

    return res.json(productos)

  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener productos',
      error: error.message
    })
  }
}

// GET /api/recursos/:id
// Consultar un producto por su ID
export async function getProductById(req, res) {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Id inválido'
      })
    }

    const producto = await Product.findById(id)

    if (!producto) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      })
    }

    return res.json(producto)

  } catch (error) {
    return res.status(500).json({
      message: 'Error en el servidor',
      error: error.message
    })
  }
}

// POST /api/recursos
// Crear un producto
export async function createProduct(req, res) {
  try {
    const producto = await Product.create(req.body)

    return res.status(201).json(producto)

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: error.message
      })
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Ese código ya existe'
      })
    }

    return res.status(500).json({
      message: 'Error en el servidor',
      error: error.message
    })
  }
}

// PUT /api/recursos/:id
// Actualizar un producto
export async function updateProduct(req, res) {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Id inválido'
      })
    }

    const producto = await Product.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )

    if (!producto) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      })
    }

    return res.json(producto)

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

// DELETE /api/recursos/:id
// Eliminar un producto
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Id inválido'
      })
    }

    const producto = await Product.findByIdAndDelete(id)

    if (!producto) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      })
    }

    return res.json({
      message: 'Producto eliminado',
      id
    })

  } catch (error) {
    return res.status(500).json({
      message: 'Error en el servidor',
      error: error.message
    })
  }
}
