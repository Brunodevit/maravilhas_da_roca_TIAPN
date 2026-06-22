import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';

import productRoutes from './src/routes/productRoutes';
import userRoutes from './src/routes/userRoutes';
import favoritosRoutes from './src/routes/favoritosRoutes';
import cartRoutes from './src/routes/cartRoutes';
import orderRoutes from './src/routes/orderRoutes';

import authRoutes from './src/routes/authRoutes';
import authMiddleware from './src/middlewares/authMiddleware';

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * 🚀 CORS CORRIGIDO (PRODUÇÃO + VERCEL PREVIEW)
 */
app.use(cors({
  origin: true, // 🔥 aceita qualquer origin (resolve Vercel preview + produção)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * 🔥 IMPORTANTE: liberar preflight (evita erros OPTIONS)
 */
app.options('*', cors());

/**
 * JSON + FORM DATA
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * 📁 Arquivos estáticos (uploads)
 */
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));

/**
 * 🔓 ROTAS PÚBLICAS
 */
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/usuarios', userRoutes);

/**
 * 🔐 MIDDLEWARE DE AUTENTICAÇÃO
 */
app.use(authMiddleware);

/**
 * 🔐 ROTAS PROTEGIDAS
 */
app.use('/pedidos', orderRoutes);
app.use('/cart', cartRoutes);
app.use('/favoritos', favoritosRoutes);

/**
 * 🚀 START SERVER
 */
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});