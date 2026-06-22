import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import userService from '../services/userService'

interface LoginBody {
  email: string
  senha: string
}

export const login = async (
  req: Request<{}, {}, LoginBody>,
  res: Response
) => {
  try {
    const { email, senha } = req.body

    if (!email || !senha) {
      return res.status(400).json({
        message: 'Email e senha são obrigatórios'
      })
    }

    // autenticação via service
    const user = await userService.loginUser(email, senha)

    const secret = process.env.JWT_SECRET

    if (!secret) {
      return res.status(500).json({
        message: 'JWT_SECRET não configurado no servidor'
      })
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      secret,
      { expiresIn: '1h' }
    )

    return res.json({
      token,
      user
    })

  } catch (error: any) {
    if (error.code === 'INVALID_CREDENTIALS') {
      return res.status(401).json({
        message: error.message
      })
    }

    console.error(error)

    return res.status(500).json({
      message: 'Erro interno no login'
    })
  }
}