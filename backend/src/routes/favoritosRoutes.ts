import { Router } from 'express'
import authMiddleware from '../middlewares/authMiddleware'

import {
  addFavorito,
  getFavoritos,
  deleteFavoritoById
} from '../controllers/favoritoController'

const router = Router()

// 🔐 tudo precisa de login
router.use(authMiddleware)

// ➕ adicionar favorito
router.post('/', addFavorito)

// 📦 listar favoritos do usuário logado
router.get('/', getFavoritos)

// ❌ remover favorito (somente do próprio usuário)
router.delete('/:favCodigo', deleteFavoritoById)

export default router