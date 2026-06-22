import pool from '../db/index'

export const FavoritoService = {

  async addFavorito(UsuCodigo: number, ProCodigo: number) {
    const [result]: any = await pool.execute(
      'INSERT INTO Favorito (UsuCodigo, ProCodigo) VALUES (?, ?)',
      [UsuCodigo, ProCodigo]
    )

    return result.insertId
  },

  async getFavoritosByUser(UsuCodigo: number) {
    const [rows] = await pool.execute(
      `
      SELECT 
        f.FavCodigo,
        p.ProCodigo,
        p.ProNome,
        p.ProPreco
      FROM Favorito f
      JOIN Produto p ON f.ProCodigo = p.ProCodigo
      WHERE f.UsuCodigo = ?
      `,
      [UsuCodigo]
    )

    return rows
  },

  async deleteById(favCodigo: number) {
    await pool.execute(
      'DELETE FROM Favorito WHERE FavCodigo = ?',
      [favCodigo]
    )
  },

  async deleteByUserAndProduct(usuCodigo: number, proCodigo: number) {
    await pool.execute(
      'DELETE FROM Favorito WHERE UsuCodigo = ? AND ProCodigo = ?',
      [usuCodigo, proCodigo]
    )
  }
}