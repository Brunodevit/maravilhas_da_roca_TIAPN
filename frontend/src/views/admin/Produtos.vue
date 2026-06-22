<template>
  <div class="min-h-screen bg-[#FDFBF7] text-[#3E2723] font-sans antialiased">

    <main class="max-w-5xl mx-auto px-6 py-10">

      <div class="mb-10 text-center md:text-left">
        <h1 class="text-3xl font-serif font-bold text-[#2B1810] mb-2">
          {{ editandoId ? 'Editar produto' : 'Cadastrar produto' }}
        </h1>
        <p class="text-[#795548] text-sm">
          {{ editandoId ? 'Altere os dados e salve.' : 'Preencha os dados e escolha uma imagem para adicionar um novo produto à roça.' }}
        </p>
      </div>

      <form @submit.prevent="salvar" class="bg-white border border-[#E5DCCB] rounded-2xl p-8 shadow-sm mb-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

          <div class="md:col-span-2">
            <label class="block text-xs font-semibold text-[#795548] mb-2 uppercase tracking-wider">Nome do produto</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Ex: Mel de abelha nativa"
              required
              class="w-full bg-[#FDFBF7] border border-[#E5DCCB] rounded-full px-5 py-3 text-[#3E2723] placeholder-[#A1887F]/60 focus:outline-none focus:border-[#3E2723] focus:ring-1 focus:ring-[#3E2723] transition-colors"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-[#795548] mb-2 uppercase tracking-wider">Categoria</label>
            <select
              v-model="form.category"
              required
              class="w-full bg-[#FDFBF7] border border-[#E5DCCB] rounded-full px-5 py-3 text-[#3E2723] focus:outline-none focus:border-[#3E2723] focus:ring-1 focus:ring-[#3E2723] transition-colors appearance-none"
            >
              <option value="Artesanais">Artesanais</option>
              <option value="Queijos">Queijos</option>
              <option value="Doces">Doces</option>
              <option value="Bebidas">Bebidas</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-[#795548] mb-2 uppercase tracking-wider">Preço (R$)</label>
            <input
              v-model.number="form.price"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
              required
              class="w-full bg-[#FDFBF7] border border-[#E5DCCB] rounded-full px-5 py-3 text-[#3E2723] placeholder-[#A1887F]/60 focus:outline-none focus:border-[#3E2723] focus:ring-1 focus:ring-[#3E2723] transition-colors"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-[#7A5C43] mb-1">Estoque Inicial</label>
            <input 
              type="number" 
              v-model.number="form.stock" 
              placeholder="Ex: 20"
              class="w-full p-2.5 rounded-xl border border-[#EED9C4] focus:outline-none focus:border-[#7A5C43]"
              min="0"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-[#795548] mb-2 uppercase tracking-wider">Foto do Produto (Nome igual da pasta)</label>
            <input
              type="file"
              accept="image/*"
              @change="selecionarFoto"
              class="w-full text-xs text-[#795548] file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#F5EBE0] file:text-[#3E2723] hover:file:bg-[#EED9C4] bg-[#FDFBF7] border border-[#E5DCCB] rounded-full p-1.5 focus:outline-none"
            />
          </div>

          <div class="md:col-span-3">
            <label class="block text-xs font-semibold text-[#795548] mb-2 uppercase tracking-wider">Descrição</label>
            <textarea
              v-model="form.description"
              placeholder="Descreva detalhes como origem, maturação..."
              rows="2"
              class="w-full bg-[#FDFBF7] border border-[#E5DCCB] rounded-2xl px-5 py-3 text-[#3E2723] placeholder-[#A1887F]/60 focus:outline-none focus:border-[#3E2723] focus:ring-1 focus:ring-[#3E2723] transition-colors resize-none"
            ></textarea>
          </div>

        </div>

        <div v-if="erro" class="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {{ erro }}
        </div>

        <div class="flex gap-3">
          <button
            type="submit"
            :disabled="salvando"
            class="bg-[#3E2723] hover:bg-[#2B1810] disabled:opacity-50 text-white font-medium px-8 py-3 rounded-full shadow-sm transition-colors"
          >
            {{ salvando ? 'Salvando...' : (editandoId ? 'Salvar alterações' : 'Cadastrar produto') }}
          </button>
          <button
            v-if="editandoId"
            type="button"
            @click="cancelarEdicao"
            class="border border-[#E5DCCB] bg-white hover:bg-[#FDFBF7] text-[#795548] px-8 py-3 rounded-full transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>

      <div>
        <h2 class="text-2xl font-serif font-bold text-[#2B1810] mb-5">Produtos cadastrados</h2>

        <div v-if="carregando" class="text-[#795548] text-sm py-8 text-center animate-pulse">Colhendo iguarias no banco de dados...</div>

        <div v-else-if="produtos.length === 0" class="text-[#795548] text-sm py-12 text-center bg-white border border-dashed border-[#E5DCCB] rounded-2xl">
          Nenhum produto cadastrado ainda.
        </div>

        <div v-else class="overflow-hidden bg-white border border-[#E5DCCB] rounded-2xl shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-sm min-w-[600px]">
              <thead>
                <tr class="border-b border-[#E5DCCB] bg-[#F5EBE0]/30 text-[#795548]">
                  <th class="text-left text-xs font-semibold uppercase tracking-wider px-6 py-4 w-20">Foto</th>
                  <th class="text-left text-xs font-semibold uppercase tracking-wider px-6 py-4">Nome / Categoria</th>
                  <th class="text-right text-xs font-semibold uppercase tracking-wider px-6 py-4">Preço</th>
                  <th class="text-right text-xs font-semibold uppercase tracking-wider px-6 py-4">Estoque</th>
                  <th class="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#E5DCCB]/60">
                <tr
                  v-for="produto in produtos"
                  :key="produto.id"
                  class="hover:bg-[#FDFBF7] transition-colors"
                >
                  <td class="px-6 py-4">
                    <div class="w-10 h-10 rounded-lg bg-[#FDFBF7] border border-[#E5DCCB] overflow-hidden flex items-center justify-center">
                      <img 
                        :src="produto.image ? `https://maravilhas-da-roca-tiapn.onrender.com/uploads/${produto.image}` : 'https://placehold.co/100x100'"
                        class="w-full h-full object-cover"
                      />
                    </div>
                  </td>

                  <td class="px-6 py-4">
                    <div class="text-[#2B1810] font-semibold">{{ produto.name }}</div>
                    <div class="text-[11px] text-[#B57C4A] font-medium">{{ produto.category || 'Artesanais' }}</div>
                  </td>
                  
                  <td class="px-6 py-4 text-right text-[#B57C4A] font-semibold">
                    R$ {{ Number(produto.price).toFixed(2) }}
                  </td>
                  
                  <td class="px-6 py-4 text-right">
                    <span
                      :class="(produto.stock ?? 0) > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'"
                      class="inline-block text-xs px-2.5 py-1 rounded-full font-medium"
                    >
                      {{ produto.stock ?? 0 }} un
                    </span>
                  </td>
                  
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-end gap-4">
                      <button
                        @click="iniciarEdicao(produto)"
                        class="text-[#B57C4A] hover:text-[#3E2723] font-medium transition-colors text-xs uppercase tracking-wider"
                      >
                        Editar
                      </button>
                      <button
                        @click="excluir(produto.id)"
                        class="text-stone-400 hover:text-red-600 transition-colors text-xs uppercase tracking-wider"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../services/api'; // Integra com a nossa instância global Axios

interface Produto {
  id: number;          
  name: string;        
  price: number;       
  stock?: number;      
  description?: string;
  category?: string;   
  image?: string;      
}

const produtos = ref<Produto[]>([]);
const carregando = ref(false);
const salvando = ref(false);
const erro = ref('');
const editandoId = ref<number | null>(null);

// Arquivo de foto selecionado localmente no input
const fotoSelecionada = ref<File | null>(null);

// O formulário usa os nomes locais simples para bindar os inputs
const form = ref({ 
  name: '', 
  price: null as unknown as number, // Começa sem número fixo para não poluir o input
  stock: 0, // 👈 Garante que começa com 0 explicitamente
  description: '', 
  category: 'Artesanais' 
});

async function buscarProdutos() {
  carregando.value = true;
  try {
    const res = await api.get('/products');
    produtos.value = res.data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    erro.value = 'Não foi possível carregar a lista de produtos.';
  } finally {
    carregando.value = false;
  }
}

// Captura o arquivo do input quando o usuário escolhe a foto
function selecionarFoto(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    fotoSelecionada.value = target.files[0];
  }
}

async function salvar() {
  erro.value = '';
  salvando.value = true;

  try {
    // 1. Criamos um objeto FormData em vez de um JSON comum
    const formData = new FormData();
    
    // 2. Anexamos todos os campos de texto e número
    formData.append('name', form.value.name);
    formData.append('description', form.value.description);
    formData.append('price', String(form.value.price));
    formData.append('category', form.value.category);

    const estoquePreenchido = form.value.stock !== undefined && form.value.stock !== null ? form.value.stock : 0;
    formData.append('stock', String(estoquePreenchido));

    // 3. Se o usuário escolheu um arquivo físico, anexamos o arquivo real.
    // O nome do campo deve ser 'image', pois é o que o Multer vai procurar no backend.
    if (fotoSelecionada.value) {
      formData.append('image', fotoSelecionada.value);
    } else if (editandoId.value) {
      // Se estamos editando e não mudou a foto, envia o nome da foto antiga
      const fotoAntiga = produtos.value.find(p => p.id === editandoId.value)?.image || 'default.png';
      formData.append('image', fotoAntiga);
    } else {
      formData.append('image', 'default.png');
    }

    console.log('Enviando FormData para o backend...');

    // 4. Enviamos o formData na requisição (o Axios configura os Headers de Multipart automaticamente)
    if (editandoId.value) {
      await api.put(`/products/${editandoId.value}`, formData);
    } else {
      await api.post('/products', formData);
    }

    resetarForm();
    await buscarProdutos();
  } catch (error: any) {
    if (error.response && error.response.data) {
      console.error('Erro detalhado do Backend:', error.response.data);
      erro.value = `Erro: ${error.response.data.error || 'Erro interno'}`;
    } else {
      console.error(error);
      erro.value = 'Erro ao salvar. Verifique se o backend está ativo.';
    }
  } finally {
    salvando.value = false;
  }
}

async function excluir(id: number) {
  if (!confirm('Excluir este produto permanentemente?')) return;
  try {
    await api.delete(`/products/${id}`);
    await buscarProdutos();
  } catch (error) {
    console.error('Erro ao excluir:', error);
    alert('Não foi possível excluir o produto.');
  }
}

function iniciarEdicao(produto: Produto) {
  editandoId.value = produto.id;
  form.value = { 
    name: produto.name, 
    price: produto.price, 
    stock: produto.stock || 0,
    description: produto.description || '',
    category: produto.category || 'Artesanais'
  };
  fotoSelecionada.value = null;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelarEdicao() {
  resetarForm();
}

function resetarForm() {
  editandoId.value = null;
  form.value = { 
    name: '', 
    price: null as unknown as number, 
    stock: 0, // 👈 Força voltar para 0 no próximo cadastro
    description: '', 
    category: 'Artesanais' 
  };
  fotoSelecionada.value = null;
}

onMounted(buscarProdutos);
</script>

<style scoped>
.font-serif {
  font-family: 'Playfair Display', Georgia, serif;
}
.font-sans {
  font-family: 'Inter', sans-serif;
}
</style>