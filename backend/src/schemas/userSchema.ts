import { z } from 'zod'

// Regex para: min 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 caractere especial
const senhaForteRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
const mensagemSenhaFraca = 'A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.'

// ===============================
// CREATE USER
// ===============================
export const createUserSchema = z.object({
  nome: z
    .string()
    .min(1, 'Nome é obrigatório'),

  email: z
    .string()
    .email('Email inválido'),

  senha: z
    .string()
    .regex(senhaForteRegex, mensagemSenhaFraca)
})

// ===============================
// UPDATE USER
// ===============================
export const updateUserSchema = z.object({
  nome: z
    .string()
    .min(1, 'Nome é obrigatório')
    .optional(),

  email: z
    .string()
    .email('Email inválido')
    .optional(),

  senha: z
    .string()
    .regex(senhaForteRegex, mensagemSenhaFraca)
    .optional()
})

// ===============================
// LOGIN USER
// ===============================
export const loginUserSchema = z.object({
  email: z
    .string()
    .email('Email inválido'),

  senha: z
    .string()
    .min(1, 'Senha é obrigatória') // não bloquear usuários antigos
})