<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useShopStore } from "../stores/shop";

const router = useRouter();
const shop = useShopStore();

const isUserOpen = ref(false);
const userEmail = ref<string | null>(null);
const isLoggedIn = ref(false); // 👈 Nova flag para controlar se há alguém logado

const cartCount = computed(() => shop.cartCount);
const favoritesCount = computed(() => shop.favoritesCount);

const loadUser = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    isLoggedIn.value = false;
    userEmail.value = null;
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // Aceita tanto .email do cliente quanto .email ou .login que venha do admin
    userEmail.value = payload.email || payload.login || "Administrador";
    isLoggedIn.value = true; // 👈 Confirmado que está logado
  } catch {
    userEmail.value = null;
    isLoggedIn.value = false;
  }
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user_role"); // 👈 Garante que limpa o papel do usuário também

  shop.clearStore();
  isUserOpen.value = false;
  isLoggedIn.value = false;

  router.push("/login");
};

onMounted(async () => {
  loadUser();

  if (!isLoggedIn.value) return;

  try {
    await Promise.all([
      shop.loadCart(),
      shop.loadFavorites(),
    ]);
  } catch (err) {
    console.error("Erro no carregamento dos dados do Header:", err);
  }
});
</script>

<template>
  <header class="sticky top-0 z-50 backdrop-blur-2xl bg-[#FDFBF7]/80 border-b border-[#EED9C4]/40 px-4 py-3 md:py-4">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6">
      
      <div class="flex items-center justify-between md:justify-start gap-3 w-full md:w-auto">
        
        <RouterLink to="/" class="flex items-center gap-2 sm:gap-3 shrink-0">
          <img src="/images/logo_sem_fundo.png" class="w-10 h-10 sm:w-14 sm:h-14 object-contain" />
          <div class="flex flex-col leading-tight">
            <span class="text-base sm:text-xl font-serif font-black text-[#362212]">
              Maravilhas da <span class="text-[#A0522D]"> Roça </span>
            </span>
            <span class="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#A0522D]/70 font-bold">
              Sabor Ancestral
            </span>
          </div>
        </RouterLink>

        <div class="flex items-center gap-2 md:hidden">
          <RouterLink to="/carrinho" class="relative block">
            <div class="w-9 h-9 rounded-full flex items-center justify-center bg-[#FAF6EE] border border-[#EED9C4]">
              🛒
            </div>
            <span class="absolute -top-1 -right-1 bg-[#A0522D] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              {{ cartCount }}
            </span>
          </RouterLink>

          <div class="relative">
            <button @click="isUserOpen = !isUserOpen" class="w-9 h-9 rounded-full flex items-center justify-center bg-[#FAF6EE] border border-[#EED9C4]">
              👤
            </button>
          </div>
        </div>

      </div>

      <div class="flex items-center gap-4 md:gap-6 flex-1 justify-end w-full md:w-auto">
        
        <div class="w-full md:max-w-xs relative">
          <input
            v-model="shop.searchQuery"
            type="text"
            placeholder="Buscar produtos..."
            class="w-full bg-[#FAF6EE] border border-[#EED9C4]/70 rounded-2xl px-4 py-2 pl-9 text-xs focus:outline-none focus:border-[#A0522D] transition-colors"
          />
          <span class="absolute left-3 top-2.5 text-xs opacity-70"> 🔍 </span>
        </div>

        <nav class="hidden lg:flex items-center gap-5 text-sm font-bold text-[#7A5C43] shrink-0">
          <RouterLink to="/" class="hover:text-[#362212] transition-colors"> Início </RouterLink>
          <RouterLink to="/catalogo" class="hover:text-[#362212] transition-colors"> Catálogo </RouterLink>
          <RouterLink to="/meus-pedidos" class="hover:text-[#362212] transition-colors"> Meus Pedidos </RouterLink>
          <RouterLink to="/sobre" class="hover:text-[#362212] transition-colors"> Sobre </RouterLink>
        </nav>

        <div class="hidden md:flex items-center gap-3 shrink-0">
          <RouterLink to="/favoritos" title="Meus Favoritos" class="relative block group">
            <div class="w-10 h-10 rounded-full flex items-center justify-center bg-[#FAF6EE] border border-[#EED9C4] group-hover:border-[#A0522D]/40 transition-all duration-300">
              ❤️
            </div>
            <span class="absolute -top-1 -right-1 bg-[#A0522D] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              {{ favoritesCount }}
            </span>
          </RouterLink>

          <RouterLink to="/carrinho" title="Meu Carrinho" class="relative block group">
            <div class="w-10 h-10 rounded-full flex items-center justify-center bg-[#FAF6EE] border border-[#EED9C4] group-hover:border-[#A0522D]/40 transition-all duration-300">
              🛒
            </div>
            <span class="absolute -top-1 -right-1 bg-[#A0522D] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              {{ cartCount }}
            </span>
          </RouterLink>

          <button @click="isUserOpen = !isUserOpen" title="Minha Conta" class="w-10 h-10 rounded-full flex items-center justify-center bg-[#FAF6EE] border border-[#EED9C4] hover:border-[#A0522D]/40 transition-all duration-300">
            👤
          </button>
        </div>

        <div v-if="isUserOpen" class="absolute right-4 mt-2 w-52 bg-white border border-[#EED9C4] rounded-xl shadow-xl z-50 py-1" :style="isUserOpen ? 'top: 100%' : ''">
          
          <div v-if="isLoggedIn">
            <div class="px-4 py-3 border-b border-[#EED9C4]/30">
              <p class="text-xs text-[#7A5C43] font-medium">Logado como:</p>
              <p class="text-sm font-bold truncate text-[#362212]">{{ userEmail }}</p>
            </div>

            <div class="block lg:hidden border-b border-[#EED9C4]/20 pb-1">
              <RouterLink to="/" @click="isUserOpen = false" class="flex items-center gap-2 px-4 py-2 text-sm text-[#7A5C43] hover:bg-[#FAF6EE] hover:text-[#362212] transition-colors font-medium">🏠 Início</RouterLink>
              <RouterLink to="/catalogo" @click="isUserOpen = false" class="flex items-center gap-2 px-4 py-2 text-sm text-[#7A5C43] hover:bg-[#FAF6EE] hover:text-[#362212] transition-colors font-medium">📖 Catálogo</RouterLink>
              <RouterLink to="/favoritos" @click="isUserOpen = false" class="flex items-center justify-between px-4 py-2 text-sm text-[#7A5C43] hover:bg-[#FAF6EE] hover:text-[#362212] transition-colors font-medium">
                <span class="flex items-center gap-2">❤️ Meus Favoritos</span>
                <span class="bg-[#A0522D]/10 text-[#A0522D] text-[10px] font-bold px-2 py-0.5 rounded-full">{{ favoritesCount }}</span>
              </RouterLink>
              <RouterLink to="/meus-pedidos" @click="isUserOpen = false" class="flex items-center gap-2 px-4 py-2 text-sm text-[#7A5C43] hover:bg-[#FAF6EE] hover:text-[#362212] transition-colors font-medium">📦 Meus Pedidos</RouterLink>
              <RouterLink to="/sobre" @click="isUserOpen = false" class="flex items-center gap-2 px-4 py-2 text-sm text-[#7A5C43] hover:bg-[#FAF6EE] hover:text-[#362212] transition-colors font-medium">ℹ️ Sobre Nós</RouterLink>
            </div>

            <button @click="logout" class="w-full text-left px-4 py-2.5 text-sm text-red-600 font-bold hover:bg-red-50 transition-colors">
              Sair
            </button>
          </div>

          <div v-else class="py-2 px-2">
            <p class="text-xs text-center text-[#7A5C43] mb-2 font-medium">Você não está logado</p>
            <RouterLink to="/login" @click="isUserOpen = false" class="block text-center w-full bg-[#362212] text-white text-xs py-2 rounded-lg font-bold hover:bg-[#A0522D] transition-colors">
              Entrar na Conta 🌾
            </RouterLink>
          </div>

        </div>

      </div>
    </div>
  </header>
</template>