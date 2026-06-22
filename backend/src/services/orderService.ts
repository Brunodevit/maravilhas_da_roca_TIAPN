import db from '../db';

export const createOrderService = async (
  userId: number, 
  tipo: string, 
  total: number, 
  itens: any[], 
  nomeCliente: string, 
  telefoneCliente: string
) => {
  // Usamos uma Transação para garantir que se algo der errado (como falta de estoque), nada seja salvo pela metade
  const connection = await db.getConnection(); 
  await connection.beginTransaction();

  try {
    // 1. Insere o registro principal na tabela Pedidos
    // Colunas: usuario_id, tipo, status, total, nome_cliente, telefone_cliente
    const [orderResult]: any = await connection.query(
      `INSERT INTO Pedidos (usuario_id, tipo, status, total, nome_cliente, telefone_cliente) 
       VALUES (?, ?, 'Pendente', ?, ?, ?)`,
      [userId, tipo, total, nomeCliente, telefoneCliente]
    );

    const pedidoId = orderResult.insertId;

    // 2. Loop para salvar cada item e abater o estoque
    for (const item of itens) {
      const produtoId = item.produto_id || item.id;
      const qtd = item.quantidade;
      const preco = item.preco_unitario || item.preco;

      // Insere na tabela ItensPedido
      await connection.query(
        `INSERT INTO ItensPedido (pedido_id, produto_id, quantidade, preco_unitario) 
         VALUES (?, ?, ?, ?)`,
        [pedidoId, produtoId, qtd, preco]
      );

      // 🔥 Abate do estoque automaticamente no formato novo (stock) que configuramos antes
      await connection.query(
        `UPDATE Produto SET ProEstoque = ProEstoque - ? WHERE ProCodigo = ?`,
        [qtd, produtoId]
      );
    }

    // 3. Limpa o carrinho do usuário após a compra com sucesso
    // (Ajuste o nome da tabela 'CarrinhoItem' ou 'Carrinho' se o delete for diferente no seu projeto)
    await connection.query(
      `DELETE FROM CarrinhoItem WHERE CarCodigo = (SELECT CarCodigo FROM Carrinho WHERE UsuCodigo = ?)`,
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
  // 1. Busca os pedidos principais do usuário
  const [pedidos]: any = await db.query(
    `SELECT id, usuario_id, tipo, status, total, nome_cliente, telefone_cliente, data_criacao 
     FROM Pedidos 
     WHERE usuario_id = ? 
     ORDER BY data_criacao DESC`, 
    [userId]
  );

  // 2. Para cada pedido, busca os produtos comprados pertencentes a ele
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
    // Embutimos a lista de itens dentro do objeto do pedido
    pedido.itens = itens;
  }

  return pedidos;
};

// Busca TODOS os pedidos para o Painel do Admin + inclui os produtos comprados
export const getAllOrdersService = async () => {
  // 1. Busca todos os pedidos principais
  const [pedidos]: any = await db.query(
    `SELECT id, usuario_id, tipo, status, total, nome_cliente, telefone_cliente, data_criacao 
     FROM Pedidos 
     ORDER BY data_criacao DESC`
  );

  // 2. Para cada pedido, busca os produtos comprados pertencentes a ele
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
    // Embutimos a lista de itens dentro do objeto do pedido
    pedido.itens = itens;
  }

  return pedidos;
};

// Atualiza o status do pedido pelo Admin
export const updateOrderStatusService = async (pedidoId: number, novoStatus: string) => {
  await db.query(
    `UPDATE Pedidos SET status = ? WHERE id = ?`,
    [novoStatus, pedidoId]
  );
  return { id: pedidoId, status: novoStatus };
};