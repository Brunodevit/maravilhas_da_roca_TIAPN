import dotenv from 'dotenv';
dotenv.config();

// 2. Depois faz os outros imports normais
import express from 'express';
import cors from 'cors';
import path from 'path'; // 👈 Adicionado para gerenciar os caminhos de arquivos
import productRoutes from './src/routes/productRoutes';
import userRoutes from './src/routes/userRoutes';
import favoritosRoutes from './src/routes/favoritosRoutes';
import cartRoutes from './src/routes/cartRoutes';
import orderRoutes from './src/routes/orderRoutes';

// 🔐 ADICIONADO (AUTH)
import authRoutes from './src/routes/authRoutes';
import authMiddleware from './src/middlewares/authMiddleware';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://maravilhas-da-roca-tiapn.vercel.app', // 🛡️ URL exata do seu frontend no Vite
  credentials: true,                // 🛡️ Permite o envio de cookies e tokens em requests com credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 🛑 ADICIONADO: Permite que o Express entenda os dados textuais enviados via FormData junto com a foto
app.use(express.urlencoded({ extended: true }));

// 🛑 ADICIONADO: Torna a pasta de uploads de fotos pública. 
// O Vue vai conseguir acessar as fotos em http://localhost:3000/uploads/nome_da_foto.jpg
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


// 🔓 ROTAS PÚBLICAS (Acessíveis sem Token)
app.use('/auth', authRoutes);
app.use('/products', productRoutes); // Listagem pública, proteção de escrita interna nas rotas
app.use('/usuarios', userRoutes);


// 🔐 MIDDLEWARE DE PROTEÇÃO (Tudo abaixo dele exige Token válido)
app.use(authMiddleware);


// 🔐 ROTAS PROTEGIDAS
app.use('/pedidos', orderRoutes);
app.use('/cart', cartRoutes);
app.use('/favoritos', favoritosRoutes);


app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando em http://localhost:${PORT}`);
});