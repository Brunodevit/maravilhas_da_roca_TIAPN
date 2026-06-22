import pool from '../db/index'

// ===============================
// GET ALL
// ===============================
export const getAll = async () => {
  const [rows]: any = await pool.execute(
    'SELECT * FROM Produto ORDER BY ProCodigo ASC'
  )

  return rows
}

// ===============================
// GET BY ID
// ===============================
export const getById = async (id: number) => {
  const [rows]: any = await pool.execute(
    'SELECT * FROM Produto WHERE ProCodigo = ?',
    [id]
  )

  return rows[0]
}

// ===============================
// CREATE (Ajustado para incluir o ProCodigo e o ProEstoque)
// ===============================
export const create = async (name: string, description: string, price: number, image: string, category: string, stock: number) => {
  let nextId = 1;

  try {
    const [maxRows]: any = await pool.execute(
      'SELECT MAX(ProCodigo) as maxId FROM Produto'
    );
    
    if (maxRows && maxRows.length > 0 && maxRows[0].maxId !== null && maxRows[0].maxId !== undefined) {
      nextId = Number(maxRows[0].maxId) + 1;
    }
  } catch (err) {
    console.error('Aviso ao buscar MAX(Id), usando fallback ID=1:', err);
  }

  // ADICIONADO: 'ProEstoque' na query e mais um '?' com o valor de 'stock' no final
  const [result]: any = await pool.execute(
    `INSERT INTO Produto (ProCodigo, ProNome, ProDesc, ProPreco, ProImagem, ProCategoria, ProEstoque) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [nextId, name, description, price, image, category, stock]
  )
  
  return nextId
}

// ===============================
// UPDATE
// ===============================
export const update = async (id: number, name: string, description: string, price: number, image: string, category: string, stock: number) => {
  const [result]: any = await pool.execute(
    `UPDATE Produto 
     SET ProNome = ?, ProDesc = ?, ProPreco = ?, ProImagem = ?, ProCategoria = ?, ProEstoque = ? 
     WHERE ProCodigo = ?`,
    [name, description, price, image, category, stock, id] // 👈 ProEstoque incluído no UPDATE do MySQL!
  );

  return result.affectedRows;
};

// ===============================
// DELETE
// ===============================
export const remove = async (id: number) => {
  const [result]: any = await pool.execute(
    'DELETE FROM Produto WHERE ProCodigo = ?',
    [id]
  )

  return result.affectedRows
}