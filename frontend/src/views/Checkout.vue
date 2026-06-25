<script setup>
import api from '../services/api';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useShopStore } from '../stores/shop';
import Footer from '../components/footer.vue';

const shop = useShopStore();
const router = useRouter();

// Dados do formulário simplificados
const form = ref({
  tipoPedido: 'reserva', // 'reserva' ou 'whatsapp'
  nome: '',
  telefone: ''
});

const isProcessing = ref(false);

// 🔥 IMPORTANTE: Coloque o número do WhatsApp da sua loja aqui (Apenas números, com DDI 55)
const whatsappDaLoja = "5531988224939"; 

// Calcula o total do pedido
const totalPedido = computed(() => {
  return shop.cartItems.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
});

// Garante que o carrinho está carregado
onMounted(() => {
  if (shop.cartItems.length === 0) {
    shop.loadCart();
  }
});

// Função principal de finalizar
const finalizarCompra = async () => {
  // Validação
  if (!form.value.nome || !form.value.telefone) {
    alert("Por favor, preencha seu nome e telefone para continuarmos.");
    return;
  }

  isProcessing.value = true;

  try {
    // ==========================================
    // 1. SALVAR O PEDIDO NO BANCO DE DADOS (BACKEND)
    // ==========================================
    await api.post('/pedidos', {
      tipo: form.value.tipoPedido,
      nome: form.value.nome,
      telefone: form.value.telefone,
      total: totalPedido.value,
      itens: shop.cartItems
    });

    // ==========================================
    // 2. AÇÕES DE TELA (WHATSAPP OU ALERTA)
    // ==========================================
    if (form.value.tipoPedido === 'whatsapp') {
      let texto = `Olá! Gostaria de finalizar meu pedido.\n\n`;
      texto += `*Nome:* ${form.value.nome}\n`;
      texto += `*Telefone:* ${form.value.telefone}\n`;
      texto += `*Tipo de Atendimento:* Pagamento via PIX e combinar entrega/retirada\n\n`;
      texto += `*📦 ITENS DO PEDIDO:*\n`;
      
      shop.cartItems.forEach(item => {
        texto += `- ${item.quantidade}x ${item.nome} (R$ ${(item.preco * item.quantidade).toFixed(2)})\n`;
      });
      
      texto += `\n*Total a pagar:* ${totalPedido.value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}\n\n`;
      texto += `Aguardo a chave PIX para realizar o pagamento!`;

      // Cria a URL do WhatsApp e abre em uma nova aba
      const url = `https://wa.me/${whatsappDaLoja}?text=${encodeURIComponent(texto)}`;
      window.open(url, '_blank');

    } else {
      // Se for reserva, só avisa o cliente
      alert(`✅ Reserva confirmada, ${form.value.nome}!\n\nSeus produtos já estão sendo separados. Você tem até 24 horas para vir à nossa loja realizar o pagamento presencialmente e retirar os produtos.`);
    }

    // ==========================================
    // 3. LIMPAR CARRINHO E REDIRECIONAR
    // ==========================================
    shop.cartItems = []; // Esvazia o carrinho visualmente
    router.push('/meus-pedidos'); 

  } catch (error) {
    // 🔥 A MÁGICA ACONTECE AQUI: Pegamos a mensagem exata do leão de chácara!
    console.error("Erro ao processar:", error);
    const mensagemDoServidor = error.response?.data?.message || "Ocorreu um erro de comunicação com o servidor.";
    
    // Mostra na tela o motivo exato de ter sido barrado (ex: "Estoque insuficiente")
    alert(`❌ Não foi possível finalizar o pedido:\n\n${mensagemDoServidor}`);
  } finally {
    isProcessing.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#FAF6EE] text-[#4A3728] flex flex-col antialiased">
    
    <nav class="max-w-7xl mx-auto px-4 pt-8 w-full">
      <button 
        @click="router.back()" 
        class="flex items-center gap-2 text-[#A0522D] hover:text-[#362212] transition-colors font-semibold text-sm uppercase tracking-widest"
      >
        ← Voltar para o carrinho
      </button>
    </nav>

    <main class="flex-1 max-w-7xl mx-auto px-4 py-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-10">
      
      <div class="lg:col-span-7 space-y-8">
        <div>
          <h1 class="text-3xl font-black text-[#362212] mb-2">Finalizar Pedido</h1>
          <p class="text-[#7A5C43]">Escolha como prefere finalizar sua compra com a gente.</p>
        </div>

        <div class="bg-white p-8 rounded-3xl shadow-sm border border-[#EED9C4]/40 space-y-8">
          
          <div>
            <h2 class="text-xl font-bold text-[#362212] border-b border-gray-100 pb-2 mb-4">Como deseja prosseguir?</h2>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label 
                class="border-2 rounded-2xl p-5 cursor-pointer flex flex-col gap-2 transition-all relative overflow-hidden" 
                :class="form.tipoPedido === 'reserva' ? 'border-[#A0522D] bg-[#A0522D]/5 shadow-md' : 'border-gray-200 hover:border-[#EED9C4]'"
              >
                <input type="radio" v-model="form.tipoPedido" value="reserva" class="hidden">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">🛍️</span>
                  <span class="font-bold text-[#362212] text-lg">Reserva na Loja</span>
                </div>
                <p class="text-sm text-[#7A5C43] leading-relaxed mt-1">Nós separamos seu pedido. Você vem até a loja, paga presencialmente e retira os produtos.</p>
                <div v-if="form.tipoPedido === 'reserva'" class="absolute top-0 right-0 bg-[#A0522D] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase">Selecionado</div>
              </label>

              <label 
                class="border-2 rounded-2xl p-5 cursor-pointer flex flex-col gap-2 transition-all relative overflow-hidden" 
                :class="form.tipoPedido === 'whatsapp' ? 'border-[#25D366] bg-[#25D366]/5 shadow-md' : 'border-gray-200 hover:border-[#EED9C4]'"
              >
                <input type="radio" v-model="form.tipoPedido" value="whatsapp" class="hidden">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">💬</span>
                  <span class="font-bold text-[#362212] text-lg">Pagar via WhatsApp</span>
                </div>
                <p class="text-sm text-[#7A5C43] leading-relaxed mt-1">Finalize o pagamento via PIX conversando direto com a gente no WhatsApp.</p>
                <div v-if="form.tipoPedido === 'whatsapp'" class="absolute top-0 right-0 bg-[#25D366] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase">Selecionado</div>
              </label>
            </div>

            <div v-if="form.tipoPedido === 'reserva'" class="mt-4 bg-[#FAF6EE] border border-[#EED9C4] p-4 rounded-xl flex items-start gap-3">
              <span class="text-xl">⏱️</span>
              <p class="text-sm text-[#7A5C43]"><strong>Atenção:</strong> Ao confirmar a reserva, você terá um prazo de <strong>24 horas</strong> para ir à nossa loja realizar o pagamento e a retirada. Após esse prazo, os produtos voltarão para o catálogo.</p>
            </div>
            
            <div v-if="form.tipoPedido === 'whatsapp'" class="mt-4 bg-[#FAF6EE] border border-[#EED9C4] p-4 rounded-xl flex items-start gap-3">
              <span class="text-xl">📱</span>
              <p class="text-sm text-[#7A5C43]"><strong>Como funciona:</strong> Ao confirmar, nós vamos gerar uma mensagem automática com o resumo do seu pedido e abrir o WhatsApp da loja para você enviar. Nós te passaremos a chave PIX por lá!</p>
            </div>
          </div>

          <div>
            <h2 class="text-xl font-bold text-[#362212] border-b border-gray-100 pb-2 mb-4">Seus Dados</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-[#7A5C43] mb-1">Nome Completo *</label>
                <input v-model="form.nome" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-colors" placeholder="João da Silva">
              </div>
              <div>
                <label class="block text-sm font-bold text-[#7A5C43] mb-1">Telefone / WhatsApp *</label>
                <input v-model="form.telefone" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-colors" placeholder="(31) 90000-0000">
              </div>
            </div>
          </div>

        </div>
      </div>

      <div class="lg:col-span-5">
        <div class="bg-[#362212] text-[#FAF6EE] rounded-3xl p-8 sticky top-8 shadow-2xl">
          <h2 class="text-2xl font-serif font-black mb-6 border-b border-[#FAF6EE]/20 pb-4">Resumo da Cesta</h2>
          
          <div class="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
            <div v-for="item in shop.cartItems" :key="item.id" class="flex justify-between items-center bg-[#4A3728] p-3 rounded-xl">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-white/10 rounded-lg overflow-hidden shrink-0">
                  <img 
                    :src="item.imagem && (item.imagem.startsWith('http://') || item.imagem.startsWith('https://')) 
                      ? item.imagem 
                      : `https://maravilhas-da-roca-tiapn.onrender.com/uploads/${item.imagem || 'default.png'}`" 
                    alt="Imagem do produto"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p class="font-bold text-sm line-clamp-1">{{ item.nome }}</p>
                  <p class="text-xs text-[#EED9C4]">{{ item.quantidade }}x R$ {{ item.preco.toFixed(2) }}</p>
                </div>
              </div>
              <p class="font-bold text-[#C5A880]">R$ {{ (item.preco * item.quantidade).toFixed(2) }}</p>
            </div>
          </div>

          <div class="space-y-3 border-t border-[#FAF6EE]/20 pt-6">
            <div class="flex justify-between items-end mt-4 pt-4 border-t border-[#FAF6EE]/20">
              <span class="text-lg font-bold">Total do Pedido</span>
              <span class="text-3xl font-black text-[#C5A880]">
                {{ totalPedido.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) }}
              </span>
            </div>
          </div>

          <button 
            @click="finalizarCompra"
            :disabled="isProcessing"
            class="w-full mt-8 py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            :class="form.tipoPedido === 'whatsapp' ? 'bg-[#25D366] text-white hover:bg-[#20bd5a]' : 'bg-[#C5A880] text-[#362212] hover:bg-[#EED9C4]'"
          >
            <span v-if="!isProcessing && form.tipoPedido === 'whatsapp'" class="text-xl">💬</span>
            <span v-if="!isProcessing && form.tipoPedido === 'reserva'" class="text-xl">🛍️</span>
            
            <span>{{ isProcessing ? 'Processando...' : (form.tipoPedido === 'whatsapp' ? 'Finalizar no WhatsApp' : 'Confirmar Reserva') }}</span>
          </button>
          
        </div>
      </div>
    </main>

    <Footer class="mt-auto" />
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(250, 246, 238, 0.1); border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #C5A880; border-radius: 4px; }
</style>