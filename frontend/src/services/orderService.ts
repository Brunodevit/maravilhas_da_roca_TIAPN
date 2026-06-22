import api from './api';

// Interfaces de tipagem para segurança do TypeScript
export interface ItemPedidoPayload {
  produto_id: number;
  quantidade: number;
  preco_unitario: number;
}

export interface OrderPayload {
  tipo: 'Manual' | 'Online';
  total: number;
  nome_cliente: string;
  telefone: string;
  itens: ItemPedidoPayload[];
}

const orderService = {
  /**
   * Envia uma nova ordem para o servidor.
   * ⚠️ ATENÇÃO: Se o erro 404 persistir, mude o '/orders' abaixo para a rota
   * exata do seu backend (como '/pedidos' ou '/orders/create').
   */
  criarPedido: async (payload: OrderPayload) => {
    const response = await api.post('/orders', payload);
    return response.data;
  },

  /**
   * Busca a lista completa de pedidos para o painel do administrador.
   */
  listarTodosAdmin: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  /**
   * Atualiza o status de entrega/preparo de um pedido.
   */
  atualizarStatus: async (pedidoId: number, novoStatus: string) => {
    const response = await api.patch(`/orders/${pedidoId}`, { status: novoStatus });
    return response.data;
  }
};

export default orderService;