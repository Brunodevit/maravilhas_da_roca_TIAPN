<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useShopStore } from '../stores/shop'; 

const router = useRouter();
const shop = useShopStore();

const isUserOpen = ref(false);
const userEmail = ref<string | null>(null);
const isLoggedIn = ref(false);

const loadUser = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    isLoggedIn.value = false;
    userEmail.value = null;
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    userEmail.value = payload.email || payload.login || "Administrador";
    isLoggedIn.value = true;
  } catch {
    userEmail.value = null;
    isLoggedIn.value = false;
  }
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user_role');
  
  shop.clearStore();
  isUserOpen.value = false;
  isLoggedIn.value = false;
  
  router.push('/login');
};

onMounted(() => {
  loadUser();
});
</script>

<template>
  <header class="sticky top-0 z-50 backdrop-blur-2xl bg-[#FDFBF7]/80 border-b border-[#EED9C4]/40 px-4 py-3 md:py-4 select-none">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6">
      
      <div class="flex items-center justify-between md:justify-start gap-3 w-full md:w-auto">
        <RouterLink to="/admin/produtos" class="flex items-center gap-2 sm:gap-3 shrink-0">
          <img src="/images/logo_sem_fundo.png" class="w-10 h-10 sm:w-14 sm:h-14 object-contain" />
          <div class="flex flex-col leading-tight">
            <div class="flex items-center gap-1.5">
              <span class="text-base sm:text-xl font-serif font-black text-[#362212]">
                Maravilhas da <span class="text-[#A0522D]"> Roça </span>
              </span>
              <span class="text-[9px] font-extrabold uppercase bg-[#A0522D] text-white px-1.5 py-0.5 rounded tracking-wider">
                Admin
              </span>
            </div>
            <span class="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#A0522D]/70 font-bold">
              Painel de Controle
            </span>
          </div>
        </RouterLink>

        <div class="flex items-center gap-2 md:hidden">
          <button @click="isUserOpen = !isUserOpen" class="w-9 h-9 rounded-full flex items-center justify-center bg-[#FAF6EE] border border-[#EED9C4]">
            👤
          </button>
        </div>
      </div>

      <div class="flex items-center gap-4 md:gap-6 flex-1 justify-end w-full md:w-auto">
        
        <nav class="hidden md:flex items-center gap-6 text-sm font-bold text-[#7A5C43] shrink-0">
          <RouterLink to="/admin/produtos" class="hover:text-[#362212] transition-colors" active-class="text-[#A0522D] border-b-2 border-[#A0522D]">
            Produtos
          </RouterLink>
          <RouterLink to="/admin/estoque" class="hover:text-[#362212] transition-colors" active-class="text-[#A0522D] border-b-2 border-[#A0522D]">
            Estoque
          </RouterLink>
          <RouterLink to="/admin/pedidos" class="hover:text-[#362212] transition-colors" active-class="text-[#A0522D] border-b-2 border-[#A0522D]">
            Pedidos
          </RouterLink>
        </nav>

        <div class="hidden md:flex items-center gap-3 shrink-0 relative">
          <button @click="isUserOpen = !isUserOpen" title="Minha Conta" class="w-10 h-10 rounded-full flex items-center justify-center bg-[#FAF6EE] border border-[#EED9C4] hover:border-[#A0522D]/40 transition-all duration-300">
            👤
          </button>
        </div>

        <div v-if="isUserOpen" class="absolute right-4 mt-2 w-56 bg-white border border-[#EED9C4] rounded-xl shadow-xl z-50 py-1" :style="isUserOpen ? 'top: 100%' : ''">
          
          <div v-if="isLoggedIn">
            <div class="px-4 py-3 border-b border-[#EED9C4]/30">
              <p class="text-xs text-[#7A5C43] font-medium">Administrador:</p>
              <p class="text-sm font-bold truncate text-[#362212]">{{ userEmail }}</p>
            </div>

            <div class="block md:hidden border-b border-[#EED9C4]/20 pb-1">
              <RouterLink to="/admin/produtos" @click="isUserOpen = false" class="flex items-center gap-2 px-4 py-2 text-sm text-[#7A5C43] hover:bg-[#FAF6EE] hover:text-[#362212] transition-colors font-medium">📦 Produtos</RouterLink>
              <RouterLink to="/admin/estoque" @click="isUserOpen = false" class="flex items-center gap-2 px-4 py-2 text-sm text-[#7A5C43] hover:bg-[#FAF6EE] hover:text-[#362212] transition-colors font-medium">🪵 Estoque</RouterLink>
              <RouterLink to="/admin/pedidos" @click="isUserOpen = false" class="flex items-center gap-2 px-4 py-2 text-sm text-[#7A5C43] hover:bg-[#FAF6EE] hover:text-[#362212] transition-colors font-medium">🌾 Pedidos</RouterLink>
            </div>

            <button @click="logout" class="w-full text-left px-4 py-2.5 text-sm text-red-600 font-bold hover:bg-red-50 transition-colors">
              Sair do Painel
            </button>
          </div>

          <div v-else class="py-2 px-2">
            <RouterLink to="/login" @click="isUserOpen = false" class="block text-center w-full bg-[#362212] text-white text-xs py-2 rounded-lg font-bold hover:bg-[#A0522D] transition-colors">
              Fazer Login 🌾
            </RouterLink>
          </div>

        </div>

      </div>
    </div>
  </header>
</template>