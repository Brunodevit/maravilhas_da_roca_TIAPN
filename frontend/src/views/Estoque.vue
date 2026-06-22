<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useShopStore } from "../stores/shop";

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

// Reutiliza o campo shop.searchQuery global para filtrar o estoque se o produtor quiser digitar no Header
// E também adiciona um filtro local por categoria
const selectedCategory = ref("Todos");

const filteredInventory = computed(() => {
  let list = products.value;

  // Filtro por busca de texto (mesma lógica tratada com trim)
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

// Mock/Fetch respeitando a mesma rota que você usou na Home
onMounted(async () => {
  try {
    const res = await fetch("http://localhost:3000/products");
    if (!res.ok) throw new Error("Falha na resposta do servidor");
    const data = await res.json();
    
    // Mapeia garantindo tipos e inserindo um stock fictício caso a API não envie
    products.value = data.map((item: any) => ({
      id: Number(item.id),
      name: item.name,
      description: item.description || "",
      price: Number(item.price || 0),
      image: item.image || "",
      stock: item.stock !== undefined ? Number(item.stock) : Math.floor(Math.random() * 25), // Fallback seguro
      category: item.category || "Artesanais"
    }));
  } catch (error) {
    console.error("Erro ao carregar estoque:", error);
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
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EED9C4]/50 border border-[#D9B48F]/40 text-[11px] font-black uppercase tracking-widest text-[#A0522D] mb-3">
            ⚙️ Painel de Controle de Lotes
          </div>
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
                ? 'bg-[#A0522D] text-white' 
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
            <p class="text-2xl font-black text-[#362212]">R$ {{ totalStockValue.toFixed(2) }}</p>
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
                <th class="p-5">Quantidade</th>
                <th class="p-5">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#EED9C4]/20 text-sm">
              <tr v-for="item in filteredInventory" :key="item.id" class="hover:bg-[#FAF6EE]/40 transition">
                
                <td class="p-5 flex items-center gap-4">
                  <div class="w-12 h-12 rounded-xl bg-[#FAF6EE] border border-[#EED9C4]/40 overflow-hidden shrink-0">
                    <img 
                      :src="produto.image && (produto.image.startsWith('http://') || produto.image.startsWith('https://')) 
                        ? produto.image 
                        : `http://localhost:3000/uploads/${produto.image || 'default.png'}`" 
                      alt="Imagem do produto"
                      class="w-full h-full object-cover"
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

                <td class="p-5 font-black text-base" :class="item.stock <= 5 ? 'text-red-600' : 'text-[#362212]'">
                  {{ item.stock }} <span class="text-xs font-normal text-[#7A5C43]">un.</span>
                </td>

                <td class="p-5">
                  <span v-if="item.stock === 0" class="inline-block px-2.5 py-1 rounded-full text-[10px] font-black bg-red-100 text-red-700 uppercase">
                    Esgotado
                  </span>
                  <span v-else-if="item.stock <= 5" class="inline-block px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 uppercase">
                    Repor Urgente
                  </span>
                  <span v-else class="inline-block px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase">
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