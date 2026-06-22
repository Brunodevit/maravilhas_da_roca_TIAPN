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
 * 🚀 CORS DEFINITIVO (VERCEL + LOCAL + PRODUÇÃO)
 */
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (
      origin.includes("localhost") ||
      origin.includes(".vercel.app")
    ) {
      return callback(null, true);
    }

    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

/**
 * 🔥 CORS (ÚNICO E CORRETO)
 */
app.use(cors(corsOptions));

/**
 * ❌ IMPORTANTE: NÃO usar app.options('*') no Express 5
 * Express já trata preflight automaticamente
 */

/**
 * JSON + FORM DATA
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * 📁 arquivos estáticos
 */
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));

/**
 * 🔓 ROTAS PÚBLICAS
 */
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/usuarios', userRoutes);

/**
 * 🔐 AUTH MIDDLEWARE
 */
app.use(authMiddleware);

/**
 * 🔐 ROTAS PROTEGIDAS
 */
app.use('/pedidos', orderRoutes);
app.use('/cart', cartRoutes);
app.use('/favoritos', favoritosRoutes);

/**
 * 🚀 START SERVER (OBRIGATÓRIO 0.0.0.0 no Render)
 */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});