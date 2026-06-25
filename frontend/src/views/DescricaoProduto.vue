<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useShopStore } from '../stores/shop';
import { addToCart } from '../services/cartService';
import Footer from '../components/footer.vue';

// Props recebida automaticamente pela configuração do router (props: true)
const props = defineProps<{
  id: string | number;
}>();

const shop = useShopStore();
const route = useRoute();
const router = useRouter();

// Busca o produto específico na lista da Store pelo ID
const product = computed(() => {
  return shop.products.find((p) => String(p.id) === String(props.id));
});

// Lógica de adicionar ao carrinho (igual à do catálogo)
const addProductToCart = async () => {
  if (!product.value) return;

  const p = product.value as any;
  const estoqueVindo = p.ProEstoque !== undefined ? p.ProEstoque : (p.stock !== undefined ? p.stock : p.estoque);

  // 1. Barreira se o produto já estiver zerado na loja
  if (estoqueVindo !== undefined && estoqueVindo <= 0) {
    alert(`Lamento! O produto "${product.value.name}" está esgotado no momento. 🌾`);
    return;
  }

  // 🔥 2. NOVA BARREIRA: Checar se o que já tem no carrinho + 1 passa do limite
  const itemNoCarrinho = shop.cartItems.find(i => Number(i.id) === Number(p.id || p.ProCodigo));
  const quantidadeJaNoCarrinho = itemNoCarrinho ? itemNoCarrinho.quantidade : 0;

  if (quantidadeJaNoCarrinho + 1 > estoqueVindo) {
    alert(`Ops! Temos apenas ${estoqueVindo} unidade(s) de "${product.value.name}" em estoque e ela(s) já está(ão) na sua cesta! 🧺`);
    return;
  }

  try {
    await addToCart(Number(product.value?.id), 1);
    shop.addCart(1);
    // Atualizamos o carrinho silenciosamente para o Pinia saber a nova quantidade
    await shop.loadCart(); 
    alert(`"${product.value.name}" foi adicionado à sua cesta! 🧺`);
  } catch (error: any) {
    // 🔥 TRAVA VISUAL DO BACKEND
    const mensagemDoServidor = error.response?.data?.message || "Não foi possível adicionar o item.";
    alert(`Não foi possível adicionar: ${mensagemDoServidor}`);
    console.error("Erro ao adicionar ao carrinho:", error);
  }
};

// Lógica de favoritos
const toggleFavorite = async () => {
  if (product.value) {
    await shop.toggleFavorite(Number(product.value.id));
  }
};

const isFavorite = computed(() => 
  shop.favorites.some(f => Number(f.ProCodigo) === Number(props.id))
);

// Garante que os produtos estejam carregados ao abrir a página
onMounted(() => {
  if (shop.products.length === 0) {
    shop.loadProducts();
  }
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-[#FAF6EE] via-[#FDFBF7] to-[#F3EAD9] text-[#4A3728] antialiased">
    
    <!-- Botão Voltar -->
    <nav class="max-w-7xl mx-auto px-4 pt-8">
      <button 
        @click="router.back()" 
        class="flex items-center gap-2 text-[#A0522D] hover:text-[#362212] transition-colors font-semibold text-sm uppercase tracking-widest"
      >
        ← Voltar para o catálogo
      </button>
    </nav>

    <main class="max-w-7xl mx-auto px-4 py-12 lg:py-20">
      <div v-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        <!-- Lado Esquerdo: Imagem -->
        <div class="relative group">
          <div class="aspect-square rounded-[2.5rem] overflow-hidden border border-[#EED9C4]/40 shadow-2xl bg-white">
            <img 
              :src="product.image && (product.image.startsWith('http://') || product.image.startsWith('https://')) 
                ? product.image 
                : `https://maravilhas-da-roca-tiapn.onrender.com/uploads/${product.image || 'default.png'}`" 
              alt="Imagem do produto"
              class="w-full h-full object-cover"
            />
          </div>
          
          <!-- Badge de Categoria -->
          <div class="absolute -top-4 -right-4 bg-[#362212] text-[#FAF6EE] px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
            {{ product.category || 'Artesanal' }}
          </div>
        </div>

        <!-- Lado Direito: Informações -->
        <div class="flex flex-col space-y-6 sm:space-y-8">
          <div>
            <h1 class="text-4xl sm:text-6xl font-serif font-black text-[#362212] leading-tight mb-4">
              {{ product.name }}
            </h1>
            <div class="w-20 h-1 bg-[#A0522D]/30"></div>
          </div>

          <p class="text-lg sm:text-xl text-[#7A5C43] leading-relaxed font-light italic">
            "{{ product.description }}"
          </p>

          <div class="flex items-baseline gap-4">
            <span class="text-4xl font-serif font-black text-[#362212]">
              R$ {{ Number(product.price || 0).toFixed(2) }}
            </span>
            <span class="text-sm text-[#7A5C43] font-medium uppercase tracking-tighter">unidade artesanal</span>
          </div>

          <!-- Ações -->
          <div class="flex flex-col sm:flex-row gap-4 pt-6">
            <button 
              @click="addProductToCart"
              :disabled="product.ProEstoque !== undefined && product.ProEstoque <= 0"
              :class="(product.ProEstoque !== undefined && product.ProEstoque <= 0) ? 'bg-gray-400 cursor-not-allowed opacity-60' : 'bg-[#362212] hover:bg-[#A0522D]'"
              class="flex-1 text-[#FAF6EE] py-4 rounded-full font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-xl active:scale-95"
            >
              {{ (product.ProEstoque !== undefined && product.ProEstoque <= 0) ? 'Esgotado no Momento' : 'Adicionar à Cesta' }}
            </button>

            <button 
              @click="toggleFavorite"
              class="px-8 py-4 rounded-full border-2 border-[#EED9C4] flex items-center justify-center transition-all hover:bg-white"
              :class="{ 'border-red-200 bg-red-50': isFavorite }"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="w-6 h-6 transition-colors" 
                :class="isFavorite ? 'text-red-500 fill-red-500' : 'text-[#422A17]'"
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                fill="none"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          <!-- Info Extra -->
          <div class="grid grid-cols-2 gap-4 pt-8 border-t border-[#EED9C4]/40">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-[#EED9C4]/30 flex items-center justify-center text-xl">🛡️</div>
              <p class="text-[10px] uppercase font-bold tracking-widest text-[#7A5C43]">100% Natural e Seguro</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado de Carregamento -->
      <div v-else class="flex flex-col items-center py-40">
        <div class="w-12 h-12 border-4 border-[#EED9C4] border-t-[#A0522D] rounded-full animate-spin"></div>
        <p class="mt-4 font-serif italic text-[#7A5C43]">Buscando as melhores relíquias...</p>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
/* Transição suave para imagens */
img {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
</style>