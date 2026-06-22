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

/**
 * 🚀 PORTA CORRETA (RENDER)
 */
const PORT = process.env.PORT || 3000;

/**
 * 🚀 CORS (RECOMENDADO MANTER)
 */
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Lista de origens fixas permitidas (como seu ambiente local)
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173', // Porta padrão do Vite, caso use
      'http://localhost:8080'
    ];

    // 1. Se não houver origin (ex: Postman, ferramentas de teste), permite.
    // 2. Se a origem terminar com '.vercel.app', permite (resolve o problema dos deploys da Vercel).
    // 3. Se a origem estiver na lista de allowedOrigins, permite.
    if (!origin || origin.endsWith('.vercel.app') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado pela política de CORS'));
    }
  },
  credentials: true, // OBRIGATÓRIO: Permite o envio de cookies/headers de autenticação
  optionsSuccessStatus: 200
};

// Ativa o CORS com as novas regras
app.use(cors(corsOptions));
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
 * 🚀 START SERVER
 */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});