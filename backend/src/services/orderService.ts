import db from '../db';

export const createOrderService = async (
  userId: number, 
  tipo: string, // Guarde se necessário, ou ajuste conforme colunas reais de Venda se houverem
  total: number, 
  itens: any[], 
  nomeCliente: string, // Se sua tabela Venda não tiver essas colunas de nome/telefone, o SQL original ignora ou você adapta
  telefoneCliente: string
) => {
  const connection = await db.getConnection(); 
  await connection.beginTransaction();

  try {
    // 1. Insere na tabela Venda (baseado no seu script.sql)
    const [orderResult]: any = await connection.query(
      `INSERT INTO Venda (UsuCodigo, VenTotal) VALUES (?, ?)`,
      [userId, total]
    );

    const vendaId = orderResult.insertId;

// 2. Loop para salvar itens e abater estoque
    for (const item of itens) {
      // 🌟 Forçando a conversão para Number para evitar bugs de comparação de String
      const produtoId = Number(item.produto_id || item.id || item.ProCodigo);
      const qtd = Number(item.quantidade || item.Quantidade);
      const preco = Number(item.preco_unitario || item.preco || item.ProPreco);

      // 🔥 SEGURANÇA: Verificação de estoque concorrente (FOR UPDATE)
      const [produtoDb]: any = await connection.query(
        `SELECT ProEstoque, ProNome FROM Produto WHERE ProCodigo = ? FOR UPDATE`, 
        [produtoId]
      );

      // 🌟 Correção de segurança: Primeiro checa se o produto existe, depois checa o estoque com segurança
      if (!produtoDb || produtoDb.length === 0) {
        throw new Error(`Produto com ID ${produtoId} não foi encontrado no sistema.`);
      }

      const estoqueDisponivel = Number(produtoDb[0].ProEstoque);

      // 👇 ADICIONE ESTA LINHA AQUI! (O nosso espião)
      console.log(`🚨 [TESTE DE ESTOQUE] Produto ID: ${produtoId} | O cliente quer: ${qtd} | O banco diz que tem: ${estoqueDisponivel}`);

      if (estoqueDisponivel < qtd) {
        throw new Error(`Estoque insuficiente para o produto: ${produtoDb[0].ProNome || produtoId}. Disponível: ${estoqueDisponivel}`);
      }

      // Insere na tabela VendaItem
      await connection.query(
        `INSERT INTO VendaItem (VenCodigo, ProCodigo, Quantidade, PrecoUnitario) 
         VALUES (?, ?, ?, ?)`,
        [vendaId, produtoId, qtd, preco]
      );

      // Abate do estoque automaticamente
      await connection.query(
        `UPDATE Produto SET ProEstoque = ProEstoque - ? WHERE ProCodigo = ?`,
        [qtd, produtoId]
      );
    }

    // 3. Limpa o carrinho do usuário
    await connection.query(
      `DELETE FROM CarrinhoItem WHERE CarCodigo = (SELECT CarCodigo FROM Carrinho WHERE UsuCodigo = ?)`,
      [userId]
    );

    await connection.commit();
    return { id: vendaId, message: 'Venda realizada com sucesso' };

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