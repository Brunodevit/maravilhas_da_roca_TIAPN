import { Request, Response } from 'express'
import { ZodError } from 'zod'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

import userService from '../services/userService'
import {
  createUserSchema,
  updateUserSchema,
  loginUserSchema
} from '../schemas/userSchema'

dotenv.config()

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20

    const users = await userService.getAllUsers(page, limit)

    return res.json(users)
  } catch {
    return res.status(500).json({
      message: 'Erro ao buscar usuários'
    })
  }
}

export const createUser = async (req: Request, res: Response) => {
  try {
    const { nome, email, senha } =
      createUserSchema.parse(req.body)

    const id = await userService.createUser(
      nome,
      email,
      senha
    )

    return res.status(201).json({
      message: 'Usuário criado!',
      id
    })
  } catch (err: any) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        errors: err.issues
      })
    }

    if (
      err.code === 'EMAIL_EXISTS' ||
      err.code === 'ER_DUP_ENTRY'
    ) {
      return res.status(409).json({
        message: 'Email já está em uso'
      })
    }

    return res.status(500).json({
      message: 'Erro interno do servidor.'
    })
  }
}

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params

  if (!req.user || req.user.id !== Number(id)) {
    return res.status(403).json({
      message: 'Acesso negado'
    })
  }

  const user = await userService.getUserById(Number(id))

  if (!user) {
    return res.status(404).json({
      message: 'Usuário não encontrado'
    })
  }

  return res.json(user)
}

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const data = updateUserSchema.parse(req.body)

    if (!req.user || req.user.id !== Number(id)) {
      return res.status(403).json({
        message: 'Acesso negado'
      })
    }

    const updateData = {
      ...(data.nome && { UsuNome: data.nome }),
      ...(data.email && { UsuEmail: data.email }),
      ...(data.senha && { UsuSenha: data.senha })
    }

    const updated = await userService.updateUser(
      Number(id),
      updateData
    )

    if (!updated) {
      return res.status(404).json({
        message: 'Usuário não encontrado'
      })
    }

    return res.json({
      message: 'Usuário atualizado com sucesso!'
    })
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        errors: err.issues
      })
    }

    return res.status(500).json({
      message: 'Erro interno do servidor'
    })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    if (!req.user || req.user.id !== Number(id)) {
      return res.status(403).json({
        message: 'Acesso negado'
      })
    }

    const deleted = await userService.deleteUser(
      Number(id)
    )

    if (!deleted) {
      return res.status(404).json({
        message: 'Usuário não encontrado'
      })
    }

    return res.json({
      message: 'Usuário deletado com sucesso!'
    })
  } catch {
    return res.status(500).json({
      message: 'Erro interno do servidor'
    })
  }
}

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, senha } =
      loginUserSchema.parse(req.body)

    const user = await userService.loginUser(
      email,
      senha
    )

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1h'
      }
    )

    return res.json({
      message: 'Login bem-sucedido!',
      token
    })
  } catch (err: any) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        errors: err.issues
      })
    }

    if (err.code === 'INVALID_CREDENTIALS') {
      return res.status(401).json({
        message: err.message
      })
    }

    return res.status(500).json({
      message: 'Erro interno do servidor'
    })
  }
}