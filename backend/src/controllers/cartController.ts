import { Request, Response } from 'express'
import {
  addItemService,
  getCartService,
  updateItemService,
  removeItemService
} from '../services/cartService'


// ➕ adicionar item
export const addToCart = async (req: Request, res: Response) => {
  try {

    const userId = req.user.id
    const { product_id, quantity } = req.body

    const result = await addItemService(userId, product_id, quantity)

    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao adicionar item no carrinho',
      error
    })
  }
}

// 📦 pegar carrinho
export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id

    const result = await getCartService(userId)

    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao buscar carrinho',
      error
    })
  }
}

// 🔁 atualizar item
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id
    const { product_id, quantity } = req.body

    const result = await updateItemService(userId, product_id, quantity)

    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao atualizar item do carrinho',
      error
    })
  }
}

// ❌ remover item
export const removeItemFromCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    // 🔥 MUDANÇA AQUI: Pega o ID da URL (params) em vez do body
    const product_id = req.params.id; 

    // O restante continua igualzinho!
    const result = await removeItemService(userId, product_id);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao remover item do carrinho',
      error
    });
  }
}