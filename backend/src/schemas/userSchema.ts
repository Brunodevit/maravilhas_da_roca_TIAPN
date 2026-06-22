import { z } from 'zod'

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
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
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
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
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
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
})