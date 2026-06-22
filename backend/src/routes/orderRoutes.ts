import express, { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import { 
  createOrder, 
  getUserOrders, 
  getAllOrders, 
  updateOrderStatus 
} from '../controllers/orderController';

const orderRoutes: Router = express.Router();

// Todas as rotas de pedidos precisam do usuário logado
orderRoutes.use(authMiddleware);

// ==========================================
// 🛒 ROTAS DO CLIENTE (USUÁRIO LOGADO)
// ==========================================

// ➕ Criar um novo pedido (Reserva)
orderRoutes.post('/', createOrder);

// 📦 Buscar pedidos do usuário logado (Histórico)
orderRoutes.get('/', getUserOrders);


// ==========================================
// 👑 ROTAS DO ADMINISTRADOR
// ==========================================

// 📋 Buscar TODOS os pedidos do sistema (Painel Admin)
orderRoutes.get('/admin', getAllOrders);

// 🔄 Atualizar o status de um pedido específico (Mudar de Pendente para Enviado, etc.)
orderRoutes.put('/admin/:id/status', updateOrderStatus);

export default orderRoutes;