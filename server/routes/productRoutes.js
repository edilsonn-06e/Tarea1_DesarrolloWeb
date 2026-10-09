
import { Router } from 'express'

import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct
} from '../controllers/productController.js'

import {
  protegerRuta,
  soloAdmin
} from '../middleware/authMiddleware.js'

const router = Router()

// Rutas públicas: cualquier visitante puede consultar productos
router.get('/', getProducts)
router.get('/:id', getProductById)

// Rutas protegidas: únicamente administradores
router.post('/', protegerRuta, soloAdmin, createProduct)
router.put('/:id', protegerRuta, soloAdmin, updateProduct)
router.delete('/:id', protegerRuta, soloAdmin, deleteProduct)

export default router
