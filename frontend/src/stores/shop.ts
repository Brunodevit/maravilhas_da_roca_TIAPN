import { defineStore } from "pinia";
import api from "../services/api";
import { getCart, updateCartItem, removeItemFromCart } from "../services/cartService";
import { getProducts } from "../services/productService"; 
import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
} from "../services/favoritesService";

interface Favorite {
  FavCodigo: number;
  ProCodigo: number;
}

interface Product {
  id: number | string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  procategoria?: string;
  ProCategoria?: string;
  stock?: number;
}

// 📦 Interface para guiar a estrutura visual dos pedidos
interface Order {
  id: number;
  usuario_id: number;
  tipo: string;
  status: string;
  total: number;
  nome_cliente: string;
  telefone_cliente: string;
  data_criacao: string;
}

export const useShopStore = defineStore("shop", {
  state: () => ({
    products: [] as Product[], 
    cartItems: [] as any[],
    cartCount: 0,
    favorites: [] as Favorite[],
    userOrders: [] as Order[], // 📦 Armazena os pedidos do cliente logado
    adminOrders: [] as Order[], // 👑 Armazena todos os pedidos para a visão do Admin
    searchQuery: "",
    isLoadingCart: false,
    isLoadingFavorites: false,
    isLoadingProducts: false, 
    isLoadingOrders: false, // Controla o esqueleto/carregamento das listas de pedidos
    selectedCategory: "Todas",
    togglingFavorites: [] as number[],
  }),

  getters: {
    favoritesCount: (state) => state.favorites.length,
  },

  actions: {
    async loadProducts() {
      if (this.isLoadingProducts) return;
      this.isLoadingProducts = true;

      try {
        const response = await getProducts();
        const rawProducts = response?.data || response || [];
        
        this.products = rawProducts.map((p: any) => ({
          id: p.id !== undefined ? p.id : p.ProCodigo,
          name: p.name || p.ProNome || "Produto sem nome",
          description: p.description || p.ProDesc || "",
          price: Number(p.price !== undefined ? p.price : (p.ProPreco || 0)),
          image: p.image || p.ProImagem || "default.png",
          category: p.category || p.procategoria || p.ProCategoria || "Artesanais",
          ProCategoria: p.category || p.ProCategoria || "Artesanais",
          stock: p.stock !== undefined ? Number(p.stock) : Number(p.ProEstoque || 0),
          ProEstoque: p.stock !== undefined ? Number(p.stock) : Number(p.ProEstoque || 0)
        }));

      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        this.products = [];
      } finally {
        this.isLoadingProducts = false;
      }
    },

    addCart(amount = 1) {
      this.cartCount += amount;
    },

    setCartCount(count: number) {
      this.cartCount = count;
    },

    clearStore() {
      this.products = [];
      this.cartCount = 0;
      this.favorites = [];
      this.userOrders = [];
      this.adminOrders = [];
      this.searchQuery = "";
      this.selectedCategory = "Todas";
      this.togglingFavorites = [];
    },

    async toggleFavorite(productId: number) {
      const id = Number(productId);

      if (this.togglingFavorites.includes(id)) return;
      this.togglingFavorites.push(id);

      try {
        const index = this.favorites.findIndex(
          (f) => Number(f.ProCodigo) === id,
        );

        if (index !== -1) {
          const removed = this.favorites[index];
          this.favorites.splice(index, 1);
          const favId = Number(removed.FavCodigo);
          await removeFromFavorites(favId);
          return;
        }

        const temp: Favorite = {
          FavCodigo: Date.now(),
          ProCodigo: id,
        };

        this.favorites.push(temp);
        const response = await addToFavorites(id);
        const raw = response?.data || response;
        const realId = Number(raw?.FavCodigo || raw?.favCodigo || raw?.id);

        if (realId) {
          const item = this.favorites.find(
            (f) => Number(f.ProCodigo) === id && f.FavCodigo === temp.FavCodigo,
          );
          if (item) item.FavCodigo = realId;
        }
      } catch (error) {
        console.error("Erro ao alternar favorito:", error);
        this.favorites = this.favorites.filter(
          (f) => Number(f.ProCodigo) !== id,
        );
      } finally {
        this.togglingFavorites = this.togglingFavorites.filter((x) => x !== id);
      }
    },

    async loadCart() {
      if (this.isLoadingCart) return;
      this.isLoadingCart = true;

      try {
        const response = await getCart();
        const items = response?.data?.items || response?.items || response?.data || [];

        this.cartItems = items.map((i: any) => ({
          id: i.id || i.ProCodigo || i.product_id,
          nome: i.name || i.ProNome || "Produto",
          preco: Number(i.price !== undefined ? i.price : (i.ProPreco || i.preco || 0)),
          quantidade: Number(i.quantity !== undefined ? i.quantity : (i.Quantidade || i.quantidade || 0)),
          imagem: i.image || i.ProImagem || i.imagem || "default.png"
        }));

        this.cartCount = this.cartItems.reduce((total, item) => total + item.quantidade, 0);
        
      } catch (error) {
        console.error("Erro ao carregar carrinho:", error);
      } finally {
        this.isLoadingCart = false;
      }
    },

    async updateQuantity(productId: number, quantity: number) {
      const item = this.cartItems.find(i => Number(i.id) === Number(productId));
      if (item) {
        item.quantidade = quantity;
        this.cartCount = this.cartItems.reduce((total, i) => total + i.quantidade, 0);
      }

      try {
        await updateCartItem(productId, quantity);
      } catch (error) {
        console.error("Erro ao atualizar quantidade no servidor, revertendo...", error);
        await this.loadCart(); 
      }
    },

    async removeProduct(productId: number) {
      this.cartItems = this.cartItems.filter(i => Number(i.id) !== Number(productId));
      this.cartCount = this.cartItems.reduce((total, i) => total + i.quantidade, 0);

      try {
        await removeItemFromCart(productId);
      } catch (error) {
        console.error("Erro ao remover produto no servidor, revertendo...", error);
        await this.loadCart(); 
      }
    },

    async loadFavorites() {
      if (this.isLoadingFavorites) return;
      this.isLoadingFavorites = true;

      try {
        const response = await getFavorites();
        const rawList = response?.data || response || [];

        this.favorites = rawList.map((item: any) => ({
          FavCodigo: Number(item.FavCodigo || item.favCodigo || item.id),
          ProCodigo: Number(item.ProCodigo || item.proCodigo || item.productId),
        }));
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
        this.favorites = [];
      } finally {
        this.isLoadingFavorites = false;
      }
    },

   // =========================================================
    // 📦 GESTÃO DE PEDIDOS (INTEGRAÇÃO COM AIVEN)
    // =========================================================

    // 1️⃣ CARREGAR PEDIDOS DO CLIENTE LOGADO
    async loadUserOrders() {
      this.isLoadingOrders = true;
      try {
        // 🛡️ CORREÇÃO: Usando 'api' e batendo na rota '/pedidos' que está no index.ts do backend
        const response = await api.get('/pedidos');
        this.userOrders = response.data || [];
        return this.userOrders;
      } catch (error) {
        console.error("Erro ao carregar os teus pedidos:", error);
        return [];
      } finally {
        this.isLoadingOrders = false;
      }
    },

    // 2️⃣ KING/ADMIN: CARREGAR TODOS OS PEDIDOS DA LOJA
    async loadAllOrdersAdmin() {
      this.isLoadingOrders = true;
      try {
        // 🛡️ CORREÇÃO: Usando 'api' e batendo na rota '/pedidos/admin' (ou a rota admin configurada no orderRoutes)
        const response = await api.get('/pedidos/admin');
        this.adminOrders = response.data || [];
        return this.adminOrders;
      } catch (error) {
        console.error("Erro ao carregar todos os pedidos (Admin):", error);
        return [];
      } finally {
        this.isLoadingOrders = false;
      }
    },

    // 3️⃣ KING/ADMIN: ATUALIZAR O STATUS DE UM PEDIDO DE FORMA OTIMISTA 🚀
    async updateOrderStatus(pedidoId: number, novoStatus: string) {
      const order = this.adminOrders.find(o => o.id === pedidoId);
      if (order) order.status = novoStatus;

      try {
        // 🛡️ CORREÇÃO: Usando 'api' e batendo na rota '/pedidos/admin/:id/status'
        const response = await api.put(`/pedidos/admin/${pedidoId}/status`, {
          status: novoStatus
        });
        
        return response.data;
      } catch (error) {
        console.error("Erro ao atualizar estado do pedido no servidor, revertendo...", error);
        await this.loadAllOrdersAdmin(); // Desfaz se houver queda ou erro
        throw error;
      }
    }
  },
});