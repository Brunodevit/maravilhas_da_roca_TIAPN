import { Request, Response } from 'express'
import * as productService from '../services/productService'

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const rows = await productService.getAll()

    const formatted = rows.map((prod: any) => ({
      id: prod.ProCodigo,
      name: prod.ProNome,
      description: prod.ProDesc,
      price: Number(prod.ProPreco),
      image: prod.ProImagem,
      category: prod.ProCategoria,
      stock: Number(prod.ProEstoque || 0) // 🛑 CORRIGIDO: Agora o estoque é repassado para o frontend!
    }))

    return res.json(formatted)
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao buscar produtos' })
  }
}

export const getProductById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = Number(req.params.id)
    const prod = await productService.getById(id)

    if (!prod) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }

    return res.json({
      id: prod.ProCodigo,
      name: prod.ProNome,
      description: prod.ProDesc,
      price: Number(prod.ProPreco),
      image: prod.ProImagem,
      category: prod.ProCategoria,
      stock: Number(prod.ProEstoque || 0) // 🛑 CORRIGIDO: Adicionado aqui também!
    })
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno' })
  }
}

export const createProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, description, price, category = '', stock = 0 } = req.body;
    const image = req.file ? req.file.filename : (req.body.image || 'default.png');
    
    const id = await productService.create(name, description, Number(price), image, category, Number(stock));

    return res.status(201).json({
      message: 'Produto criado com sucesso!',
      id
    });
  } catch (error: any) {
    console.error('--- ERRO DETALHADO DO BANCO ---', error);
    return res.status(500).json({ error: 'Erro ao criar produto', detalhe: error.message });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const { name, description, price, category = '', stock = 0 } = req.body;
    const image = req.file ? req.file.filename : req.body.image;

    const affected = await productService.update(id, name, description, Number(price), image, category, Number(stock));

    if (affected === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    return res.json({ message: 'Produto updated com sucesso' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = Number(req.params.id)
    const affected = await productService.remove(id)

    if (affected === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }

    return res.json({ message: 'Produto deletado com sucesso' })
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao deletar produto' })
  }
}