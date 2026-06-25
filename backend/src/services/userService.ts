import pool from '../db/index'
import bcrypt from 'bcrypt'

interface UpdateUserFields {
  UsuNome?: string
  UsuEmail?: string
  UsuSenha?: string
  UsuRole?: string
}

const getAllUsers = async (page: number = 1, limit: number = 20) => {
  page = Math.max(Number(page), 1)
  limit = Math.min(Number(limit), 100)

  const offset = (page - 1) * limit

  const [users] = await pool.execute(
    'SELECT UsuCodigo, UsuNome, UsuEmail, UsuRole FROM Usuario LIMIT ? OFFSET ?',
    [limit, offset]
  )

  const [totalResult]: any = await pool.execute(
    'SELECT COUNT(*) as total FROM Usuario'
  )

  const total = totalResult[0].total

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    users
  }
}

const getUserById = async (id: number) => {
  const [rows]: any = await pool.execute(
    `SELECT
      UsuCodigo,
      UsuNome,
      UsuEmail,
      UsuRole
     FROM Usuario
     WHERE UsuCodigo = ?`,
    [id]
  )

  return rows[0]
}

const createUser = async (
  nome: string,
  email: string,
  senha: string
) => {
  console.log(`\n🆕 [RAIO-X CRIAR CONTA] Tentando criar usuário: Nome='${nome}', Email='${email}'`)
  
  const [existingUsers]: any = await pool.execute(
    'SELECT UsuCodigo FROM Usuario WHERE UsuEmail = ?',
    [email]
  )

  if (existingUsers.length > 0) {
    console.log(`⚠️ [RAIO-X CRIAR CONTA] Erro: O email '${email}' já existe no banco!`)
    const error: any = new Error('Email já existe')
    error.code = 'EMAIL_EXISTS'
    throw error
  }

  const hashedPassword = await bcrypt.hash(senha, 10)
  console.log(`⚙️ [RAIO-X CRIAR CONTA] Senha criptografada com sucesso. Salvando no banco...`)

  const [result]: any = await pool.execute(
    `INSERT INTO Usuario
      (UsuNome, UsuEmail, UsuSenha)
     VALUES (?, ?, ?)`,
    [nome, email, hashedPassword]
  )

  console.log(`✅ [RAIO-X CRIAR CONTA] SUCESSO! Conta salva de verdade com ID: ${result.insertId}`)
  
  return result.insertId
}

const updateUser = async (
  id: number,
  updateFields: UpdateUserFields
) => {
  const keys = Object.keys(updateFields)

  if (keys.length === 0) return 0

  const setString = keys.map((key) => `${key} = ?`).join(', ')
  const values = keys.map((key) => (updateFields as any)[key])

  values.push(id)

  const [result]: any = await pool.execute(
    `UPDATE Usuario
     SET ${setString}
     WHERE UsuCodigo = ?`,
    values
  )

  return result.affectedRows
}

const deleteUser = async (id: number) => {
  const [result]: any = await pool.execute(
    'DELETE FROM Usuario WHERE UsuCodigo = ?',
    [id]
  )

  return result.affectedRows
}

const loginUser = async (
  email: string,
  senha: string
) => {
  console.log(`\n🕵️‍♂️ [RAIO-X LOGIN] Tentando logar: Email='${email}', Senha='${senha}'`)

  const [rows]: any = await pool.execute(
    `SELECT
      UsuCodigo,
      UsuNome,
      UsuEmail,
      UsuSenha,
      UsuRole
     FROM Usuario
     WHERE UsuEmail = ?`,
    [email]
  )

  if (rows.length === 0) {
    console.log(`❌ [RAIO-X LOGIN] Erro: Nenhum usuário encontrado com o email '${email}'!`)
    const error: any = new Error('Email ou senha incorretos')
    error.code = 'INVALID_CREDENTIALS'
    throw error
  }

  const user = rows[0]
  console.log(`✅ [RAIO-X LOGIN] Usuário encontrado: ${user.UsuNome}. Comparando senhas...`)

  const isMatch = await bcrypt.compare(
    senha,
    user.UsuSenha
  )

  if (!isMatch) {
    console.log(`❌ [RAIO-X LOGIN] Erro: A senha digitada não bate com a senha do banco!`)
    const error: any = new Error('Email ou senha incorretos')
    error.code = 'INVALID_CREDENTIALS'
    throw error
  }

  console.log(`🎉 [RAIO-X LOGIN] Sucesso! Senha correta para ${user.UsuNome}.`)

  return {
    id: user.UsuCodigo,
    email: user.UsuEmail,
    role: user.UsuRole
  }
}

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser
}