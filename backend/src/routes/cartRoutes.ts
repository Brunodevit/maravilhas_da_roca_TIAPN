import express, { Router } from 'express'
import authMiddleware from '../middlewares/authMiddleware'

import {
  addToCart,
  getCart,
  removeItemFromCart,
  updateCartItem
} from '../controllers/cartController'

const cartRoutes: Router = express.Router()

// 🔐 todas rotas do carrinho precisam de login
cartRoutes.use(authMiddleware)

// ➕ adicionar item
cartRoutes.post('/add', addToCart)

// 📦 pegar carrinho do usuário logado
cartRoutes.get('/', getCart)

// 🔁 atualizar quantidade (⚠️ MUDOU DE '/item' PARA '/update')
cartRoutes.put('/update', updateCartItem)

// ❌ remover item (⚠️ MUDOU DE '/item' PARA '/remove/:id')
cartRoutes.delete('/remove/:id', removeItemFromCart)

export default cartRoutes