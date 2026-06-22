<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useShopStore } from "../../stores/shop"; // Ajustado o caminho relativo comum para subpastas admin
import api from "../../services/api"; // Injeta a nossa instância inteligente do Axios

// Mantém o padrão de tipos estritos do seu projeto
interface InventoryItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number; // Campo específico para controle de estoque
  category: string;
}

const shop = useShopStore();
const products = ref<InventoryItem[]>([]);
const loading = ref(true);

// Filtro local por categoria
const selectedCategory = ref("Todos");

const filteredInventory = computed(() => {
  let list = products.value;

  // Filtro por busca de texto global vindo do Header
  const query = shop.searchQuery.trim().toLowerCase();
  if (query) {
    list = list.filter((p) => p.name.toLowerCase().includes(query));
  }

  // Filtro por categoria
  if (selectedCategory.value !== "Todos") {
    list = list.filter((p) => p.category === selectedCategory.value);
  }

  return list;
});

// Métricas rápidas para os cards do topo
const totalProducts = computed(() => products.value.length);
const lowStockProducts = computed(() => products.value.filter(p => p.stock <= 5).length);
const totalStockValue = computed(() => {
  return products.value.reduce((total, p) => total + (Number(p.price) * Number(p.stock)), 0);
});

// Função para atualizar o estoque na hora (+ ou -) direto no Banco/Tela
const alterarEstoque = async (item: InventoryItem, quantidadeAlterar: number) => {
  const novoEstoque = item.stock + quantidadeAlterar;
  
  if (novoEstoque < 0) return; // Impede estoque negativo

  // 1. Atualiza visualmente na hora para feedback instantâneo
  const estoqueAntigo = item.stock;
  item.stock = novoEstoque;

  try {
    // 2. CORRIGIDO: Agora chama a rota real existente no backend (/products/:id)
    // Como a rota espera o formato Multipart/FormData para produtos, ou lê o JSON do update se estiver usando req.body puro:
    await api.put(`/products/${item.id}`, {
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      stock: novoEstoque // 👈 Enviando o estoque atualizado
    });
    
    console.log(`Estoque de "${item.name}" atualizado para ${novoEstoque} com sucesso.`);
  } catch (error) {
    console.error("Erro ao salvar o estoque no banco, revertendo alteração local...", error);
    item.stock = estoqueAntigo; // Se o banco falhar por algum motivo, ele desfaz na tela
    alert("Não foi possível salvar a alteração de estoque no servidor.");
  }
};

// Carregar os dados usando a nossa instância inteligente do Axios
onMounted(async () => {
  try {
    // Busca da rota correta em inglês
    const res = await api.get("/products");
    const data = res.data;
    
    // CORRIGIDO: Modificado de 'produtos.value' para 'products.value'
    products.value = data.map((item: any) => ({
      id: Number(item.id),
      name: item.name,
      description: item.description || "",
      price: Number(item.price || 0),
      image: item.image || "",
      stock: item.stock !== undefined ? Number(item.stock) : 0, 
      category: item.category || "Artesanais"
    }));
  } catch (error) {
    console.error("Erro real ao conectar com o banco de dados:", error);
    alert("Não foi possível carregar os produtos do banco de dados.");
    products.value = []; // CORRIGIDO: de 'produtos.value' para 'products.value'
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-[#FAF6EE] via-[#FDFBF7] to-[#F3EAD9] text-[#4A3728] antialiased">
    
    <section class="max-w-7xl mx-auto px-4 pt-10 pb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#EED9C4]/60 pb-6">
        <div>
          <h1 class="text-3xl font-serif font-black text-[#362212]">
            Gestão do Estoque Central
          </h1>
          <p class="text-sm text-[#7A5C43] mt-1">
            Monitore a quantidade de queijos, doces de tacho e produtos ativos no catálogo da roça.
          </p>
        </div>
        
        <div class="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <button 
            v-for="cat in ['Todos', 'Artesanais', 'Queijos', 'Doces']" 
            :key="cat"
            @click="selectedCategory = cat"
            :class="[
              selectedCategory === cat 
                ? 'bg-[#362212] text-white' 
                : 'bg-white text-[#4A3728] border border-[#EED9C4] hover:bg-[#FAF6EE]'
            ]"
            class="px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap"
          >
            {{ cat }}
          </button>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 mb-8">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div class="bg-white p-5 rounded-2xl border border-[#EED9C4]/40 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-[#FAF6EE] border border-[#EED9C4] flex items-center justify-center text-xl">📦</div>
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-[#7A5C43]/70">Total de Itens</p>
            <p class="text-2xl font-black text-[#362212]">{{ totalProducts }} produtos</p>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-[#EED9C4]/40 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-xl">⚠️</div>
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-red-700/70">Estoque Crítico (≤ 5)</p>
            <p class="text-2xl font-black text-red-600">{{ lowStockProducts }} alertas</p>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-[#EED9C4]/40 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-[#FAF6EE] border border-[#EED9C4] flex items-center justify-center text-xl">💰</div>
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-[#7A5C43]/70">Valor Total em Cesta</p>
            <p class="text-2xl font-black text-[#362212]">R$ {{ totalStockValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</p>
          </div>
        </div>

      </div>
    </section>

    <main class="max-w-7xl mx-auto px-4 pb-20">
      <div v-if="loading" class="flex flex-col justify-center items-center py-20 space-y-4">
        <div class="w-12 h-12 border-4 border-[#EED9C4]/30 border-t-[#A0522D] rounded-full animate-spin"></div>
      </div>

      <div v-else class="bg-white rounded-[2rem] border border-[#EED9C4]/30 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#FAF6EE] border-b border-[#EED9C4]/40 text-xs font-black uppercase tracking-wider text-[#7A5C43]">
                <th class="p-5">Produto</th>
                <th class="p-5">Categoria</th>
                <th class="p-5">Preço Unitário</th>
                <th class="p-5 text-center">Controle de Quantidade</th>
                <th class="p-5">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#EED9C4]/20 text-sm">
              <tr v-for="item in filteredInventory" :key="item.id" class="hover:bg-[#FAF6EE]/40 transition">
                
                <td class="p-5 flex items-center gap-4">
                  <div class="w-12 h-12 rounded-xl bg-[#FAF6EE] border border-[#EED9C4]/40 overflow-hidden shrink-0 flex items-center justify-center">
                    <img 
                      :src="item.image && (item.image.startsWith('http://') || item.image.startsWith('https://')) 
                        ? item.image 
                        : `https://maravilhas-da-roca-tiapn.onrender.com/uploads/${item.image || 'default.png'}`" 
                      alt="Imagem do produto"
                      class="w-10 h-10 object-cover rounded"
                    />
                  </div>
                  <div>
                    <h2 class="font-bold text-[#362212]">{{ item.name }}</h2>
                    <p class="text-xs text-[#7A5C43]/80 line-clamp-1 max-w-xs">{{ item.description }}</p>
                  </div>
                </td>

                <td class="p-5 font-medium text-[#7A5C43]">
                  {{ item.category }}
                </td>

                <td class="p-5 font-bold text-[#362212]">
                  R$ {{ item.price.toFixed(2) }}
                </td>

                <td class="p-5">
                  <div class="flex items-center justify-center gap-3 bg-[#FAF6EE] border border-[#EED9C4]/50 p-1.5 rounded-xl max-w-[140px] mx-auto shadow-sm">
                    <button 
                      @click="alterarEstoque(item, -1)" 
                      :disabled="item.stock <= 0"
                      class="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-[#EED9C4] hover:bg-red-50 text-red-600 font-bold text-sm transition disabled:opacity-30 disabled:hover:bg-white"
                    >
                      -
                    </button>
                    
                    <span class="font-black text-sm min-w-[28px] text-center" :class="item.stock <= 5 ? 'text-red-600' : 'text-[#362212]'">
                      {{ item.stock }}
                    </span>
                    
                    <button 
                      @click="alterarEstoque(item, 1)" 
                      class="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-[#EED9C4] hover:bg-green-50 text-green-600 font-bold text-sm transition"
                    >
                      +
                    </button>
                  </div>
                </td>

                <td class="p-5">
                  <span v-if="item.stock === 0" class="inline-block px-2.5 py-1 rounded-full text-[10px] font-black bg-red-100 text-red-700 uppercase tracking-wider border border-red-200">
                    Esgotado
                  </span>
                  <span v-else-if="item.stock <= 5" class="inline-block px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 uppercase tracking-wider border border-amber-200">
                    Repor Urgente
                  </span>
                  <span v-else class="inline-block px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase tracking-wider border border-emerald-200">
                    Estável
                  </span>
                </td>

              </tr>
              
              <tr v-if="filteredInventory.length === 0">
                <td colspan="5" class="p-20 text-center text-[#7A5C43] font-medium">
                  Nenhum produto encontrado no estoque com os filtros aplicados.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

  </div>
</template>