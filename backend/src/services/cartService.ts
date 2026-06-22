import db from '../db/index'

// ➕ adicionar item
export const addItemService = async (
  userId: number,
  productId: number,
  quantity: number
) => {
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
    await db.query(
      `UPDATE CarrinhoItem 
       SET Quantidade = Quantidade + ?
       WHERE CarCodigo = ? AND ProCodigo = ?`,
      [quantity, cartId, productId]
    )
  } else {
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

// 🔁 atualizar item
export const updateItemService = async (
  userId: number,
  productId: number,
  quantity: number
) => {
  const [cart]: any = await db.query(
    'SELECT * FROM Carrinho WHERE UsuCodigo = ?',
    [userId]
  )

  if (!cart.length) return { message: 'Carrinho não encontrado' }

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