import db from '../db';

export const createOrderService = async (
  userId: number, 
  tipo: string, 
  total: number, 
  itens: any[], 
  nomeCliente: string, 
  telefoneCliente: string
) => {
  const connection = await db.getConnection(); 
  await connection.beginTransaction();

  try {
    const [orderResult]: any = await connection.query(
      `INSERT INTO Pedidos (usuario_id, tipo, status, total, nome_cliente, telefone_cliente) 
       VALUES (?, ?, 'Pendente', ?, ?, ?)`,
      [userId, tipo, total, nomeCliente, telefoneCliente]
    );

    const pedidoId = orderResult.insertId;

    for (const item of itens) {
      const produtoId = item.produto_id || item.id;
      const qtd = Number(item.quantidade);
      const preco = item.preco_unitario || item.preco;

      const [produto]: any = await connection.query(
        `SELECT ProEstoque, ProNome 
         FROM Produto 
         WHERE ProCodigo = ?`,
        [produtoId]
      );

      if (produto.length === 0) {
        throw new Error('Produto não encontrado.');
      }

      if (produto[0].ProEstoque < qtd) {
        throw new Error(`Estoque insuficiente para o produto: ${produto[0].ProNome}`);
      }

      await connection.query(
        `INSERT INTO ItensPedido (pedido_id, produto_id, quantidade, preco_unitario) 
         VALUES (?, ?, ?, ?)`,
        [pedidoId, produtoId, qtd, preco]
      );

      await connection.query(
        `UPDATE Produto 
         SET ProEstoque = ProEstoque - ? 
         WHERE ProCodigo = ? AND ProEstoque >= ?`,
        [qtd, produtoId, qtd]
      );
    }

    await connection.query(
      `DELETE FROM CarrinhoItem 
       WHERE CarCodigo = (SELECT CarCodigo FROM Carrinho WHERE UsuCodigo = ?)`,
      [userId]
    );

    await connection.commit();
    return { id: pedidoId, status: 'Pendente' };

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Busca os pedidos do próprio usuário logado + inclui os produtos comprados
export const getUserOrdersService = async (userId: number) => {
  const [pedidos]: any = await db.query(
    `SELECT id, usuario_id, tipo, status, total, nome_cliente, telefone_cliente, data_criacao 
     FROM Pedidos 
     WHERE usuario_id = ? 
     ORDER BY data_criacao DESC`, 
    [userId]
  );

  for (const pedido of pedidos) {
    const [itens]: any = await db.query(
      `SELECT 
          ip.id, 
          ip.produto_id, 
          ip.quantidade, 
          ip.preco_unitario,
          p.ProNome AS nome_produto
       FROM ItensPedido ip
       JOIN Produto p ON ip.produto_id = p.ProCodigo
       WHERE ip.pedido_id = ?`,
      [pedido.id]
    );

    pedido.itens = itens;
  }

  return pedidos;
};

// Busca TODOS os pedidos para o Painel do Admin + inclui os produtos comprados
export const getAllOrdersService = async () => {
  const [pedidos]: any = await db.query(
    `SELECT id, usuario_id, tipo, status, total, nome_cliente, telefone_cliente, data_criacao 
     FROM Pedidos 
     ORDER BY data_criacao DESC`
  );

  for (const pedido of pedidos) {
    const [itens]: any = await db.query(
      `SELECT 
          ip.id, 
          ip.produto_id, 
          ip.quantidade, 
          ip.preco_unitario,
          p.ProNome AS nome_produto
       FROM ItensPedido ip
       JOIN Produto p ON ip.produto_id = p.ProCodigo
       WHERE ip.pedido_id = ?`,
      [pedido.id]
    );

    pedido.itens = itens;
  }

  return pedidos;
};

// Atualiza o status do pedido pelo Admin
export const updateOrderStatusService = async (pedidoId: number, novoStatus: string) => {
  await db.query(
    `UPDATE Pedidos SET status = ? WHERE id = ?`,
    [pedidoId, novoStatus]
  );

  return { id: pedidoId, status: novoStatus };
};
