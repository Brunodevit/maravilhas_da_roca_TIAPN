import { Request, Response } from 'express'
import { z } from 'zod'
import { FavoritoService } from '../services/favoritoService'

// ===============================
const FavoritoSchema = z.object({
  UsuCodigo: z.coerce.number(),
  ProCodigo: z.coerce.number()
})

// ===============================
// ADD
// ===============================
export const addFavorito = async (req: Request, res: Response) => {
  try {
    const UsuCodigo = (req as any).user.id
    const { ProCodigo } = req.body

    const id = await FavoritoService.addFavorito(UsuCodigo, ProCodigo)

    return res.status(201).json({
      message: 'Produto adicionado aos favoritos!',
      FavCodigo: id
    })
  } catch (err: any) {
    return res.status(400).json({
      error: err.message
    })
  }
}

// ===============================
// GET (🔧 ALTERADO AQUI)
// ===============================
export const getFavoritos = async (req: Request, res: Response) => {
  try {
    // 🔥 AGORA VEM DO AUTH MIDDLEWARE
    const usuCodigo = (req as any).user.id

    const data = await FavoritoService.getFavoritosByUser(usuCodigo)

    return res.json(data)
  } catch {
    return res.status(500).json({ error: 'Erro ao buscar favoritos.' })
  }
}

// ===============================
// DELETE BY ID
// ===============================
export const deleteFavoritoById = async (req: Request, res: Response) => {
  try {
    const favCodigo = Number(req.params.favCodigo)

    await FavoritoService.deleteById(favCodigo)

    return res.json({ message: 'Removido com sucesso!' })
  } catch {
    return res.status(500).json({ error: 'Erro ao remover favorito.' })
  }
}

// ===============================
// DELETE USER + PRODUCT
// ===============================
export const deleteFavoritoByUserAndProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const usuCodigo = Number(req.params.usuCodigo)
    const proCodigo = Number(req.params.proCodigo)

    await FavoritoService.deleteByUserAndProduct(usuCodigo, proCodigo)

    return res.json({ message: 'Removido com sucesso!' })
  } catch {
    return res.status(500).json({ error: 'Erro ao remover favorito.' })
  }
}