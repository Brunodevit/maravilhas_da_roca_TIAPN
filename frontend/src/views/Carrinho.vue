<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router"; // 🔥 IMPORTAR O ROUTER
import { useShopStore } from "../stores/shop";
import Footer from "../components/footer.vue";
import CartItem from "./CartItem.vue";

const shop = useShopStore();
const router = useRouter(); // 🔥 INICIAR O ROUTER

// 🔥 FUNÇÃO PARA REDIRECIONAR
function irParaCheckout() {
  // Redireciona para a rota de finalização (ajuste o nome se precisar)
  router.push('/checkout'); 
}

onMounted(() => {
  shop.loadCart();
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#FAF6EE]">
    
    <main class="flex-1 p-6 flex flex-col items-center">
      <div class="w-full max-w-4xl">
        <h1 class="text-3xl font-black text-[#3E2723] mb-8 text-left">Meu Carrinho</h1>
        
        <div v-if="shop.cartItems && shop.cartItems.length > 0">
          <CartItem 
            v-for="item in shop.cartItems" 
            :key="item.id" 
            :item="item"
            @update:quantidade="(novaQtd) => shop.updateQuantity(item.id, novaQtd)"
            @remover="() => shop.removeProduct(item.id)"
          />
          
          <div class="mt-8 p-6 bg-white rounded-2xl border border-gray-100 flex flex-col sm:flex-row justify-between items-center shadow-sm gap-6">
            <div class="flex flex-col text-center sm:text-left">
              <span class="text-xl font-bold text-[#3E2723]">Total do pedido:</span>
              <span class="text-3xl font-black text-[#C5A880]">
                {{ shop.cartItems.reduce((acc, i) => acc + (i.preco * i.quantidade), 0).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) }}
              </span>
            </div>

            <button 
              @click="irParaCheckout"
              class="w-full sm:w-auto bg-[#362212] text-[#FAF6EE] px-10 py-4 rounded-full font-bold uppercase tracking-[0.15em] hover:bg-[#A0522D] transition-all duration-300 shadow-xl active:scale-95"
            >
              Finalizar Compra →
            </button>
          </div>
        </div> <div v-else class="text-center py-20">
          <p class="text-xl text-gray-500">Sua cesta ainda está vazia.</p>
          <router-link to="/catalogo" class="text-[#C5A880] font-bold underline mt-4 inline-block">Ir para o catálogo →</router-link>
        </div> </div> </main>

    <Footer />
  </div>
</template>