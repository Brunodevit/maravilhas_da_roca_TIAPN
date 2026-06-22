import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../views/HomePage.vue'
import CatalogoProduto from '../views/CatalogoProduto.vue'
import CadastroProdutos from '../views/CadastroProdutos.vue'
import CartItem from '../views/CartItem.vue'
import DescricaoProduto from '../views/DescricaoProduto.vue'
import Favoritos from '../views/Favoritos.vue'
import ReservaProduto from '../views/ReservaProduto.vue'
import SobreNos from '../views/SobreNos.vue'
import Login from '../views/Login.vue'
import Cadastro from '../views/CadastroUsuario.vue'
import Estoque from '../views/Estoque.vue'
import Carrinho from '../views/Carrinho.vue'
import Checkout from '../views/Checkout.vue'
import MeusPedidos from '../views/MeusPedidos.vue'

// Importações do Admin
import AdminProdutos from '../views/admin/Produtos.vue'
import AdminEstoque from '../views/admin/Estoque.vue'
import AdminPedidos from '../views/admin/Pedidos.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },

  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout,
    meta: { requiresAuth: true }
  },

  {
    path: '/meus-pedidos',
    name: 'MeusPedidos',
    component: MeusPedidos,
    meta: { requiresAuth: true }
  },

  {
    path: '/estoque',
    name: 'estoque',
    component: Estoque,
    meta: { hideHeader: true }
  },

  {
    path: '/catalogo',
    name: 'catalogo',
    component: CatalogoProduto,
  },

  {
    path: '/cadastro-produtos',
    name: 'cadastro-produtos',
    component: CadastroProdutos,
    meta: { hideHeader: true }
  },

  { 
    path: '/carrinho', 
    name: 'carrinho', 
    component: Carrinho 
  },

  {
    path: '/produto/:id',
    name: 'descricao-produto',
    component: DescricaoProduto,
    props: true,
  },

  {
    path: '/favoritos',
    name: 'favoritos',
    component: Favoritos,
  },

  {
    path: '/reserva',
    name: 'reserva',
    component: ReservaProduto,
  },

  {
    path: '/sobre',
    name: 'sobre',
    component: SobreNos,
  },

  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { hideHeader: true }
  },

  {
    path: '/cadastro',
    name: 'cadastro',
    component: Cadastro,
    meta: { hideHeader: true }
  },

  // 🛡️ ROTAS DE ADMINISTRAÇÃO
  {
    path: '/admin/produtos',
    name: 'admin-produtos',
    component: AdminProdutos,
    meta: { requiresAdmin: true }
  },

  {
    path: '/admin/estoque',
    name: 'admin-estoque',
    component: AdminEstoque,
    meta: { requiresAdmin: true }
  },

  {
    path: '/admin/pedidos',
    name: 'admin-pedidos',
    component: AdminPedidos,
    meta: { requiresAdmin: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

/* =========================
   🔐 BLOQUEIO GLOBAL INTELLIGENT
========================= */
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('user_role');

  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const isAuthPage = to.name === 'login' || to.name === 'cadastro';

  // 1. 🛡️ SE NÃO ESTIVER LOGADO: Barra tudo, exceto telas de Login e Cadastro
  if (!token) {
    if (!isAuthPage) {
      // Tentou acessar qualquer página do site sem login -> Direciona pro Login
      return next({ name: 'login' });
    }
    // Se não tem token mas já está indo pro login/cadastro, deixa passar
    return next();
  }

  // 2. 🛡️ SE JÁ ESTIVER LOGADO e tentar ir para o Login/Cadastro à toa, redireciona de volta
  if (token && isAuthPage) {
    if (userRole === 'admin') {
      return next({ name: 'admin-produtos' });
    } else {
      return next({ name: 'home' }); // ou catálogo
    }
  }

  // 3. 🛡️ SE FOR ROTA DE ADMIN: Garante que apenas quem tem a role 'admin' entra
  if (requiresAdmin && userRole !== 'admin') {
    alert('Acesso negado! Área restrita para administradores. 🛑');
    return next({ name: 'catalogo' });
  }

  // Se passou por todas as validações, permite o acesso à página desejada
  next();
});

export default router;