<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useShopStore } from '../../stores/shop';
import api from '../../services/api';

// Interfaces estruturadas
interface ItemPedido {
  id?: number;
  produtoId: number;
  nome: string;
  quantidade: number;
  precoUnitario: number;
}

interface Produto {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
}

const shopStore = useShopStore();

// Estados da Tela vindos da Store Centralizada
const pedidos = computed(() => shopStore.adminOrders);
const loading = computed(() => shopStore.isLoadingOrders);
const filtroStatus = ref('Todos');

const produtosDisponiveis = ref<Produto[]>([]);

// Estados do Modal de Venda Manual
const isModalAberto = ref(false);
const clienteManual = ref('');
const telefoneManual = ref('');
const itensVendaManual = ref<ItemPedido[]>([]);

const carregarDados = async () => {
  // 1. Carrega todos os pedidos via rota administrativa do Pinia
  await shopStore.loadAllOrdersAdmin();

  // 2. Carrega catálogo de produtos disponíveis para a venda manual do balcão
  try {
    const resProdutos = await api.get('/products');
    produtosDisponiveis.value = resProdutos.data.map((p: any) => ({
      id: p.id,
      nome: p.name,
      preco: Number(p.price),
      estoque: p.stock !== undefined ? p.stock : 20
    }));
  } catch (error) {
    console.error('Erro ao buscar produtos para o Admin:', error);
  }
};

onMounted(carregarDados);

// Filtro reativo de pesquisa da tabela
const pedidosFiltrados = computed(() => {
  if (filtroStatus.value === 'Todos') return pedidos.value;
  return pedidos.value.filter(p => p.status === filtroStatus.value);
});

// Funções do Modal de Venda Manual
const abrirModalVenda = () => {
  clienteManual.value = '';
  telefoneManual.value = '';
  itensVendaManual.value = [{ produtoId: 0, nome: '', quantidade: 1, precoUnitario: 0 }];
  isModalAberto.value = true;
};

const adicionarItemNoModal = () => {
  itensVendaManual.value.push({ produtoId: 0, nome: '', quantidade: 1, precoUnitario: 0 });
};

const removerItemNoModal = (index: number) => {
  itensVendaManual.value.splice(index, 1);
};

const atualizarPrecoItem = (index: number) => {
  const item = itensVendaManual.value[index];
  const prodSelecionado = produtosDisponiveis.value.find(p => p.id === item.produtoId);
  if (prodSelecionado) {
    item.nome = prodSelecionado.nome;
    item.precoUnitario = prodSelecionado.preco;
  }
};

const totalVendaManual = computed(() => {
  return itensVendaManual.value.reduce((acc, item) => acc + (item.quantidade * item.precoUnitario), 0);
});

const salvarVendaManual = async () => {
  if (!clienteManual.value || itensVendaManual.value.some(i => i.produtoId === 0)) {
    alert('Por favor, preencha o nome do cliente e selecione os produtos!');
    return;
  }

  // Payload adaptado exatamente para a rota POST '/' de criação de ordens estruturada
  const payload = {
    tipo: 'Manual',
    total: totalVendaManual.value,
    nome: clienteManual.value,
    telefone: telefoneManual.value || 'Não informado',
    itens: itensVendaManual.value.map(i => ({
      produto_id: i.produtoId,
      quantidade: i.quantidade,
      preco_unitario: i.precoUnitario
    }))
  };

  try {
    // Registra via API, recarrega a lista do admin e fecha o modal
    await api.post('/orders', payload);
    await shopStore.loadAllOrdersAdmin();
    isModalAberto.value = false;
    alert('Venda manual registrada com sucesso diretamente na nuvem! 🌾');
  } catch (err) {
    console.error('Erro ao salvar venda manual:', err);
    alert('Erro ao salvar venda no servidor.');
  }
};

// Dispara a alteração com o recurso Optimistic Update configurado no Pinia
const alterarStatus = async (pedidoId: number, novoStatus: any) => {
  try {
    await shopStore.updateOrderStatus(pedidoId, novoStatus);
  } catch (error) {
    alert('Não foi possível atualizar o status no servidor. Revertendo...');
  }
};

const formatarData = (dataString: string) => {
  if (!dataString) return '';
  
  const data = new Date(dataString);
  if (isNaN(data.getTime())) return dataString;

  // 🕒 Subtrai as 6 horas para alinhar o dia corretamente com o fuso da loja
  data.setHours(data.getHours() - 3);

  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  
  return `${dia}/${mes}/${ano}`;
};
</script>

<template>
  <div class="min-h-screen bg-[#F6EFE6] p-6 lg:p-10 font-sans">
    
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
      <div>
        <h1 class="text-4xl font-black font-serif text-[#2E1F16] mt-1">Gestão de Pedidos</h1>
      </div>
      <button 
        @click="abrirModalVenda"
        class="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#2E1F16] hover:bg-[#C49A55] text-white font-bold tracking-wide shadow-lg transition-all text-sm"
      >
        <span>➕</span> Registrar Venda Manual
      </button>
    </div>

    <div v-if="loading" class="text-center py-10 text-[#6B4B36] font-medium animate-pulse">
      Buscando informações na nuvem da roça... 🌾
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div class="bg-white p-6 rounded-2xl border border-[#EED9C4]/60 shadow-sm flex items-center gap-4">
          <div class="text-3xl bg-[#F7F1E8] p-3 rounded-xl">📦</div>
          <div>
            <p class="text-sm text-[#6B4B36] font-medium">Total de Pedidos</p>
            <h3 class="text-2xl font-black text-[#2E1F16]">{{ pedidos.length }}</h3>
          </div>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-[#EED9C4]/60 shadow-sm flex items-center gap-4">
          <div class="text-3xl bg-green-50 text-green-700 p-3 rounded-xl">💰</div>
          <div>
            <p class="text-sm text-[#6B4B36] font-medium">Faturamento Total</p>
            <h3 class="text-2xl font-black text-[#2E1F16]">
              R$ {{ pedidos.filter(p => p.status !== 'Cancelado').reduce((acc, p) => acc + Number(p.total), 0).toFixed(2) }}
            </h3>
          </div>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-[#EED9C4]/60 shadow-sm flex items-center gap-4">
          <div class="text-3xl bg-amber-50 text-amber-700 p-3 rounded-xl">🌾</div>
          <div>
            <p class="text-sm text-[#6B4B36] font-medium">Vendas Balcão (Manual)</p>
            <h3 class="text-2xl font-black text-[#2E1F16]">
              {{ pedidos.filter(p => p.tipo === 'Manual').length }}
            </h3>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-3xl border border-[#EED9C4]/60 shadow-xl overflow-hidden">
        <div class="p-6 border-b border-[#F6EFE6] flex flex-wrap items-center justify-between gap-4">
          <div class="flex gap-2 bg-[#F7F1E8] p-1 rounded-xl">
            <button 
              v-for="status in ['Todos', 'Pendente', 'Preparando', 'Entregue', 'Cancelado']" 
              :key="status"
              @click="filtroStatus = status"
              :class="['px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all', 
                filtroStatus === status ? 'bg-[#2E1F16] text-white shadow' : 'text-[#6B4B36] hover:bg-white/60']"
            >
              {{ status.toUpperCase() }}
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#F7F1E8] text-[#6B4B36] text-xs font-bold tracking-widest uppercase border-b border-[#EED9C4]/40">
                <th class="py-4 px-6">ID</th>
                <th class="py-4 px-6">Cliente</th>
                <th class="py-4 px-6">Data</th>
                <th class="py-4 px-6">Origem</th>
                <th class="py-4 px-6">Status</th>
                <th class="py-4 px-6">Total</th>
                <th class="py-4 px-6 text-center">Ações</th>
              </tr>
            </thead>
            <!-- 🛡️ TBODY AJUSTADO PARA LISTAR PRODUTOS COMPRADOS NO PAINEL ADMIN -->
            <tbody class="divide-y divide-[#F6EFE6] text-sm text-[#2E1F16]">
              <tr v-for="pedido in pedidosFiltrados" :key="pedido.id" class="hover:bg-[#F6EFE6]/30 transition">
                <td class="py-4 px-6 font-mono font-bold text-[#C49A55]">#{{ pedido.id }}</td>
                <td class="py-4 px-6">
                  <div class="font-semibold">{{ pedido.nome_cliente || 'Cliente Web' }}</div>
                  
                  <!-- BOX DE PRODUTOS COMPRADOS (Injetado dinamicamente abaixo do nome) -->
                  <div v-if="pedido.itens && pedido.itens.length > 0" class="mt-2 space-y-1 bg-[#F7F1E8]/50 p-2 rounded-lg max-w-xs border border-[#EED9C4]/30">
                    <p v-for="(item, idx) in pedido.itens" :key="idx" class="text-xs text-[#6B4B36] flex justify-between">
                      <span>📦 <span class="font-bold text-[#2E1F16]">{{ item.quantidade }}x</span> {{ item.nome_produto }}</span>
                      <span class="font-mono text-gray-400">R$ {{ Number(item.preco_unitario).toFixed(2) }}</span>
                    </p>
                  </div>
                  <div v-else class="text-xs text-gray-400 italic mt-1">
                    Nenhum item vinculado.
                  </div>
                </td>
                <td class="py-4 px-6 text-[#6B4B36]">{{ formatarData(pedido.data_criacao || pedido.data) }}</td>
                <td class="py-4 px-6">
                  <span :class="['px-2.5 py-1 rounded-full text-xs font-bold', 
                    pedido.tipo === 'Online' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-purple-50 text-purple-700 border border-purple-200']">
                    {{ pedido.tipo || 'Online' }}
                  </span>
                </td>
                <td class="py-4 px-6">
                  <span :class="['px-2.5 py-1 rounded-full text-xs font-bold border',
                    pedido.status === 'Pendente' ? 'bg-amber-50 text-amber-800 border-amber-200' : 
                    pedido.status === 'Preparando' ? 'bg-blue-50 text-blue-800 border-blue-200' : 
                    pedido.status === 'Entregue' ? 'bg-green-50 text-green-800 border-green-200' : 
                    pedido.status === 'Cancelado' ? 'bg-red-50 text-red-800 border-red-200' : 
                    'bg-gray-50 text-gray-800 border-gray-200']">
                    {{ pedido.status }}
                  </span>
                </td>
                <td class="py-4 px-6 font-bold">R$ {{ Number(pedido.total).toFixed(2) }}</td>
                <td class="py-4 px-6 flex items-center justify-center gap-2">
                  <select 
                    @change="alterarStatus(pedido.id, ($event.target as HTMLSelectElement).value)"
                    :value="pedido.status"
                    class="bg-[#F7F1E8] border border-[#EED9C4] rounded-lg px-2 py-1 text-xs font-medium outline-none focus:ring-1 focus:ring-[#C49A55]"
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Preparando">Preparando</option>
                    <option value="Entregue">Entregue</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </td>
              </tr>
              <tr v-if="pedidosFiltrados.length === 0">
                <td colspan="7" class="text-center py-10 text-[#6B4B36] italic">
                  Nenhum pedido encontrado com esse status.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="isModalAberto" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div class="bg-white w-full max-w-2xl rounded-[2rem] border border-[#EED9C4] shadow-2xl p-8 max-h-[85vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-serif font-black text-[#2E1F16]">Nova Venda Manual</h2>
          <button @click="isModalAberto = false" class="text-2xl text-[#6B4B36] hover:text-black">&times;</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-xs uppercase tracking-widest font-bold text-[#6B4B36] mb-2">Nome do Cliente</label>
            <input 
              v-model="clienteManual"
              type="text" 
              placeholder="Ex: João da Silva"
              class="w-full px-4 py-3 rounded-xl bg-[#F7F1E8] border border-[#EED9C4] outline-none focus:ring-2 focus:ring-[#C49A55]/50 transition"
            />
          </div>
          <div>
            <label class="block text-xs uppercase tracking-widest font-bold text-[#6B4B36] mb-2">Telefone</label>
            <input 
              v-model="telefoneManual"
              type="text" 
              placeholder="Ex: (31) 98888-8888"
              class="w-full px-4 py-3 rounded-xl bg-[#F7F1E8] border border-[#EED9C4] outline-none focus:ring-2 focus:ring-[#C49A55]/50 transition"
            />
          </div>
        </div>

        <div class="mb-6">
          <div class="flex items-center justify-between mb-3">
            <label class="block text-xs uppercase tracking-widest font-bold text-[#6B4B36]">Produtos Vendidos</label>
            <button @click="adicionarItemNoModal" class="text-xs text-[#C49A55] font-bold hover:underline">
              + Adicionar Linha
            </button>
          </div>

          <div class="space-y-3">
            <div v-for="(item, index) in itensVendaManual" :key="index" class="flex gap-3 items-center">
              <select 
                v-model="item.produtoId"
                @change="atualizarPrecoItem(index)"
                class="flex-1 px-3 py-3 rounded-xl bg-[#F7F1E8] border border-[#EED9C4] text-sm outline-none focus:ring-2 focus:ring-[#C49A55]/50"
              >
                <option value="0" disabled>Selecione um produto...</option>
                <option v-for="p in produtosDisponiveis" :key="p.id" :value="p.id">
                  {{ p.nome }} (R$ {{ p.preco.toFixed(2) }})
                </option>
              </select>

              <input 
                v-model.number="item.quantidade"
                type="number" 
                min="1"
                class="w-20 px-3 py-3 rounded-xl bg-[#F7F1E8] border border-[#EED9C4] text-center outline-none focus:ring-2 focus:ring-[#C49A55]/50"
              />

              <button 
                @click="removerItemNoModal(index)" 
                :disabled="itensVendaManual.length === 1"
                class="text-red-600 hover:text-red-800 disabled:opacity-30 px-2"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>

        <hr class="border-[#F6EFE6] my-6" />

        <div class="flex items-center justify-between mb-6">
          <span class="text-sm font-bold text-[#6B4B36] uppercase tracking-wider">Total a Pagar:</span>
          <span class="text-3xl font-black font-serif text-[#2E1F16]">R$ {{ totalVendaManual.toFixed(2) }}</span>
        </div>

        <div class="flex gap-3">
          <button @click="isModalAberto = false" class="flex-1 py-3.5 rounded-xl font-bold bg-[#F7F1E8] hover:bg-[#EED9C4] text-[#6B4B36] transition">
            Cancelar
          </button>
          <button @click="salvarVendaManual" class="flex-1 py-3.5 rounded-xl font-bold bg-[#2E1F16] hover:bg-[#C49A55] text-white transition tracking-widest uppercase text-xs">
            Confirmar e Concluir
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out forwards;
}
</style>