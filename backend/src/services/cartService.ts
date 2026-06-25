import db from '../db/index'

// ➕ adicionar item
export const addItemService = async (
  userId: number,
  productId: number,
  quantity: number
) => {
  // 🔥 VALIDAÇÃO: Busca o estoque real do produto
  const [produtoDb]: any = await db.query(
    'SELECT ProEstoque FROM Produto WHERE ProCodigo = ?',
    [productId]
  );
  
  if (!produtoDb.length) throw new Error('Produto não encontrado');
  const estoqueDisponivel = produtoDb[0].ProEstoque;

  const [cart]: any = await db.query(
    'SELECT * FROM Carrinho WHERE UsuCodigo = ?',
    [userId]
  )

  let cartId: number

  if (!cart.length) {
    const [result]: any = await db.query(
      'INSERT INTO Carrinho (UsuCodigo) VALUES (?)',
      [userId]
    )
    cartId = result.insertId
  } else {
    cartId = cart[0].CarCodigo
  }

  const [item]: any = await db.query(
    'SELECT * FROM CarrinhoItem WHERE CarCodigo = ? AND ProCodigo = ?',
    [cartId, productId]
  )

  if (item.length) {
    const quantidadeAtual = item[0].Quantidade;
    const novaQuantidade = quantidadeAtual + quantity;

    // 🔥 TRAVA: Bloqueia se a soma ultrapassar o estoque
    if (novaQuantidade > estoqueDisponivel) {
      throw new Error(`Estoque insuficiente. Você só pode adicionar mais ${estoqueDisponivel - quantidadeAtual} unidade(s).`);
    }

    await db.query(
      `UPDATE CarrinhoItem 
       SET Quantidade = ?
       WHERE CarCodigo = ? AND ProCodigo = ?`,
      [novaQuantidade, cartId, productId]
    )
  } else {
    // 🔥 TRAVA: Bloqueia se o item novo passar do estoque
    if (quantity > estoqueDisponivel) {
      throw new Error(`Estoque insuficiente. Limite máximo: ${estoqueDisponivel} unidade(s).`);
    }

    await db.query(
      `INSERT INTO CarrinhoItem (CarCodigo, ProCodigo, Quantidade)
       VALUES (?, ?, ?)`,
      [cartId, productId, quantity]
    )
  }

  return { message: 'Item adicionado ao carrinho' }
}

// 📦 pegar carrinho
export const getCartService = async (userId: number) => {
  const [cart]: any = await db.query(
    'SELECT * FROM Carrinho WHERE UsuCodigo = ?',
    [userId]
  )

  if (!cart.length) {
    return { items: [], total: 0 }
  }

  const cartId = cart[0].CarCodigo

  const [items]: any = await db.query(
    `SELECT 
      ci.ProCodigo,
      ci.Quantidade,
      p.ProNome,
      p.ProPreco,
      p.ProImagem
     FROM CarrinhoItem ci
     JOIN Produto p ON p.ProCodigo = ci.ProCodigo
     WHERE ci.CarCodigo = ?`,
    [cartId]
  )

  const total = items.reduce(
    (sum: number, item: any) => sum + item.ProPreco * item.Quantidade,
    0
  )

  return { items, total }
}

// 🔁 atualizar item (direto na página do carrinho)
export const updateItemService = async (
  userId: number,
  productId: number,
  quantity: number
) => {
  // 🔥 VALIDAÇÃO: Checa o estoque antes de atualizar a quantidade
  const [produtoDb]: any = await db.query(
    'SELECT ProEstoque FROM Produto WHERE ProCodigo = ?',
    [productId]
  );
  if (!produtoDb.length) throw new Error('Produto não encontrado');
  
  const estoqueDisponivel = produtoDb[0].ProEstoque;
  if (quantity > estoqueDisponivel) {
    throw new Error(`Estoque insuficiente. Temos apenas ${estoqueDisponivel} unidade(s) em estoque.`);
  }

  const [cart]: any = await db.query(
    'SELECT * FROM Carrinho WHERE UsuCodigo = ?',
    [userId]
  )

  if (!cart.length) throw new Error('Carrinho não encontrado');

  await db.query(
    `UPDATE CarrinhoItem 
     SET Quantidade = ?
     WHERE CarCodigo = ? AND ProCodigo = ?`,
    [quantity, cart[0].CarCodigo, productId]
  )

  return { message: 'Item atualizado' }
}

// ❌ remover item
export const removeItemService = async (
  userId: number,
  productId: number
) => {
  const [cart]: any = await db.query(
    'SELECT * FROM Carrinho WHERE UsuCodigo = ?',
    [userId]
  )

  if (!cart.length) return { message: 'Carrinho não encontrado' }

  await db.query(
    'DELETE FROM CarrinhoItem WHERE CarCodigo = ? AND ProCodigo = ?',
    [cart[0].CarCodigo, productId]
  )

  return { message: 'Item removido' }
}