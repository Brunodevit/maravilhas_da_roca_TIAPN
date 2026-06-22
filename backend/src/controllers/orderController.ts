import { Request, Response } from 'express';
import { createOrderService, getUserOrdersService, getAllOrdersService, updateOrderStatusService } from '../services/orderService';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id; 
    const { tipo, total, itens, nome, telephone: telefone } = req.body;

    // Se o front enviar 'telefone' ou 'telephone', pegamos corretamente
    const telefoneCliente = telefone || req.body.telefone;

    const novoPedido = await createOrderService(userId, tipo, total, itens, nome, telefoneCliente);

    return res.status(201).json({ message: 'Pedido criado com sucesso', pedido: novoPedido });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return res.status(500).json({ message: 'Erro ao criar pedido', error });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const pedidos = await getUserOrdersService(userId);
    
    return res.status(200).json(pedidos);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return res.status(500).json({ message: 'Erro ao buscar pedidos', error });
  }
};

// 🌟 Buscar todos os pedidos (Para a tela do Admin)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const pedidos = await getAllOrdersService();
    return res.status(200).json(pedidos);
  } catch (error) {
    console.error("Erro ao buscar todos os pedidos:", error);
    return res.status(500).json({ message: 'Erro ao buscar pedidos do sistema', error });
  }
};

// 🌟 Atualizar status do pedido (Para a tela do Admin mudar de Pendente -> Enviado, etc)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // ex: { "status": "Preparando" }

    if (!status) {
      return res.status(400).json({ message: 'O campo status é obrigatório' });
    }

    const pedidoAtualizado = await updateOrderStatusService(Number(id), status);
    return res.status(200).json({ message: 'Status atualizado com sucesso', pedido: pedidoAtualizado });
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error);
    return res.status(500).json({ message: 'Erro ao atualizar status', error });
  }
};