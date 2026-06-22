<script setup>
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useShopStore } from '../stores/shop';
import Footer from '../components/footer.vue';

const router = useRouter();
const shopStore = useShopStore();

// Utiliza os estados reativos e tipados centralizados na Store
const pedidos = computed(() => shopStore.userOrders);
const isLoading = computed(() => shopStore.isLoadingOrders);

onMounted(async () => {
  // Dispara a ação que busca diretamente na nuvem (Aiven) usando credentials
  await shopStore.loadUserOrders();
});

// Sincronizado perfeitamente com os status disparados pela tela do Admin!
const getStatusBadge = (status) => {
  const statusNormalizado = String(status).toLowerCase();
  const badges = {
    pendente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    preparando: 'bg-blue-100 text-blue-800 border-blue-200',
    pago: 'bg-blue-100 text-blue-800 border-blue-200',
    entregue: 'bg-green-100 text-green-800 border-green-200',
    concluido: 'bg-green-100 text-green-800 border-green-200',
    cancelado: 'bg-red-100 text-red-800 border-red-200'
  };
  return badges[statusNormalizado] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const getStatusText = (status) => {
  const statusNormalizado = String(status).toLowerCase();
  const texts = {
    pendente: 'Aguardando Pagamento / Retirada',
    preparando: 'Preparando seu pedido na Roça 🌾',
    pago: 'Pago (Aguardando Retirada)',
    entregue: 'Pedido Entregue / Retirado 🎉',
    concluido: 'Pedido Entregue / Retirado 🎉',
    cancelado: 'Cancelado'
  };
  return texts[statusNormalizado] || status;
};

const formatarData = (dataString) => {
  if (!dataString) return '';
  
  const data = new Date(dataString);
  
  // Se a data for inválida por qualquer motivo, retorna o texto original
  if (isNaN(data.getTime())) return dataString;

  // 🕒 AJUSTE REAL: Subtrai exatamente 6 horas para converter o 03:42 (dia 22) em 21:42 (dia 21)
  data.setHours(data.getHours() - 3);

  // Extraímos os números ajustados já com o dia e hora corretos
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  
  const hora = String(data.getHours()).padStart(2, '0');
  const minuto = String(data.getMinutes()).padStart(2, '0');
  
  return `${dia}/${mes}/${ano} às ${hora}:${minuto}`;
};
</script>

<template>
  <div class="min-h-screen bg-[#FAF6EE] text-[#4A3728] flex flex-col antialiased">
    
    <nav class="max-w-4xl mx-auto px-4 pt-8 w-full">
      <button 
        @click="router.back()" 
        class="flex items-center gap-2 text-[#A0522D] hover:text-[#362212] transition-colors font-semibold text-sm uppercase tracking-widest"
      >
        ← Voltar
      </button>
    </nav>

    <main class="flex-1 max-w-4xl mx-auto px-4 py-10 w-full">
      
      <div class="mb-10">
        <h1 class="text-4xl font-black text-[#362212] mb-2 font-serif">Meus Pedidos</h1>
        <p class="text-[#7A5C43]">Acompanhe o status das suas reservas e compras de forma segura na nuvem.</p>
      </div>

      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
        <div class="w-12 h-12 border-4 border-[#EED9C4] border-t-[#A0522D] rounded-full animate-spin"></div>
        <p class="mt-4 font-serif italic text-[#7A5C43]">Buscando seus pedidos na roça...</p>
      </div>

      <div v-else-if="pedidos.length > 0" class="space-y-6">
        <div 
          v-for="pedido in pedidos" 
          :key="pedido.id"
          class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#EED9C4]/40 hover:shadow-md transition-shadow"
        >
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div>
              <p class="text-xs font-bold text-[#A0522D] uppercase tracking-widest mb-1">Pedido #{{ pedido.id }}</p>
              <p class="text-sm text-gray-500">
                Realizado em {{ formatarData(pedido.data_criacao || pedido.data) }} • 
                <span class="font-semibold">{{ pedido.tipo === 'Manual' ? 'Venda de Balcão' : 'Reserva no Site' }}</span>
              </p>
              <p v-if="pedido.nome_cliente" class="text-xs text-[#7A5C43] mt-1">Registrado para: {{ pedido.nome_cliente }}</p>
            </div>
            
            <div :class="['px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider', getStatusBadge(pedido.status)]">
              {{ getStatusText(pedido.status) }}
            </div>
          </div>

          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div class="space-y-2 flex-1">
              <p class="text-sm font-bold text-[#362212] mb-2">Itens:</p>
              
              <div v-if="pedido.itens && pedido.itens.length > 0">
                <p v-for="(item, index) in pedido.itens" :key="index" class="text-sm text-[#7A5C43] flex items-center justify-between max-w-md border-b border-gray-100 py-1">
                  <span>
                    <span class="font-bold text-[#A0522D] mr-2">{{ item.quantidade }}x</span> 
                    {{ item.nome_produto }}
                  </span>
                  <span class="text-xs text-gray-400 font-mono">
                    (Mudas/Unid: {{ Number(item.preco_unitario).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) }})
                  </span>
                </p>
              </div>
              <div v-else>
                <p class="text-sm text-gray-400 italic">Detalhes dos itens guardados no sistema.</p>
              </div>
            </div>

            <div class="text-left sm:text-right w-full sm:w-auto bg-[#FAF6EE] p-4 rounded-xl">
              <p class="text-xs text-[#7A5C43] uppercase tracking-wider mb-1">Total do Pedido</p>
              <p class="text-2xl font-black text-[#C5A880]">
                {{ Number(pedido.total).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) }}
              </p>
            </div>
          </div>

          <div v-if="String(pedido.status).toLowerCase() === 'pendente'" class="mt-6 bg-[#A0522D]/5 border border-[#A0522D]/20 p-4 rounded-xl flex items-start gap-3">
            <span class="text-xl">⏱️</span>
            <p class="text-xs text-[#A0522D]">Sua reserva está garantida. Venha até nossa loja realizar o pagamento e retirar suas delícias fresquinhas!</p>
          </div>

        </div>
      </div>

      <div v-else class="text-center py-20 bg-white rounded-3xl border border-[#EED9C4]/40">
        <span class="text-6xl mb-4 block">🛒</span>
        <h2 class="text-2xl font-bold text-[#362212] mb-2">Nenhum pedido encontrado</h2>
        <p class="text-[#7A5C43] mb-6">Você ainda não realizou nenhuma compra ou reserva com a gente.</p>
        <router-link to="/catalogo" class="bg-[#362212] text-[#FAF6EE] px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-[#A0522D] transition-colors">
          Explorar Catálogo
        </router-link>
      </div>

    </main>

    <Footer class="mt-auto" />
  </div>
</template>