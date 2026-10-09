
import { Router } from 'express'
import { getUserById } from '../controllers/userController.js'
import { protegerRuta } from '../middleware/authMiddleware.js'

const router = Router()

// Verificar que el usuario esté autenticado
// y que solo consulte su propio perfil,
// salvo que sea administrador.
router.get('/:id', protegerRuta, (req, res, next) => {
  const idSolicitado = req.params.id
  const idAutenticado = req.user.id

  if (
    idSolicitado !== idAutenticado &&
    req.user.rol !== 'admin'
  ) {
    return res.status(403).json({
      message: 'No tienes permiso para consultar este perfil'
    })
  }

  next()
}, getUserById)

export default router
