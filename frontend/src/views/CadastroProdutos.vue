<template>
  <div class="min-h-screen bg-[#FDFBF7] text-[#3E2723] font-sans">

    <main class="max-w-5xl mx-auto px-6 py-10">

      <div class="mb-10 text-center md:text-left">
        <div class="inline-block mb-3 bg-[#F5EBE0] text-[#B57C4A] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
          ✨ Painel Administrativo
        </div>
        <h1 class="text-3xl font-serif font-bold text-[#2B1810] mb-2">
          {{ editandoId ? 'Editar produto' : 'Cadastrar produto' }}
        </h1>
        <p class="text-[#795548] text-sm">{{ editandoId ? 'Altere os dados e salve.' : 'Preencha os dados para adicionar um novo produto à roça.' }}</p>
      </div>

      <form @submit.prevent="salvar" class="bg-white border border-[#E5DCCB] rounded-2xl p-8 shadow-sm mb-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

          <div class="md:col-span-3">
            <label class="block text-xs font-semibold text-[#795548] mb-2 uppercase tracking-wider">Nome do produto</label>
            <input
              v-model="form.ProNome"
              type="text"
              placeholder="Ex: Mel de abelha nativa"
              required
              class="w-full bg-[#FDFBF7] border border-[#E5DCCB] rounded-full px-5 py-3 text-[#3E2723] placeholder-[#A1887F]/60 focus:outline-none focus:border-[#3E2723] focus:ring-1 focus:ring-[#3E2723] transition-colors"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-[#795548] mb-2 uppercase tracking-wider">Preço (R$)</label>
            <input
              v-model.number="form.ProPreco"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
              required
              class="w-full bg-[#FDFBF7] border border-[#E5DCCB] rounded-full px-5 py-3 text-[#3E2723] placeholder-[#A1887F]/60 focus:outline-none focus:border-[#3E2723] focus:ring-1 focus:ring-[#3E2723] transition-colors"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-[#795548] mb-2 uppercase tracking-wider">Estoque (un)</label>
            <input
              v-model.number="form.ProEstoque"
              type="number"
              min="0"
              placeholder="0"
              required
              class="w-full bg-[#FDFBF7] border border-[#E5DCCB] rounded-full px-5 py-3 text-[#3E2723] placeholder-[#A1887F]/60 focus:outline-none focus:border-[#3E2723] focus:ring-1 focus:ring-[#3E2723] transition-colors"
            />
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

        <div v-if="carregando" class="text-[#795548] text-sm py-8 text-center">Colhendo iguarias no banco de dados...</div>

        <div v-else-if="produtos.length === 0" class="text-[#795548] text-sm py-12 text-center bg-white border border-dashed border-[#E5DCCB] rounded-2xl">
          Nenhum produto cadastrado ainda.
        </div>

        <div v-else class="overflow-hidden bg-white border border-[#E5DCCB] rounded-2xl shadow-sm">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-[#E5DCCB] bg-[#F5EBE0]/30 text-[#795548]">
                <th class="text-left text-xs font-semibold uppercase tracking-wider px-6 py-4">#</th>
                <th class="text-left text-xs font-semibold uppercase tracking-wider px-6 py-4">Nome</th>
                <th class="text-right text-xs font-semibold uppercase tracking-wider px-6 py-4">Preço</th>
                <th class="text-right text-xs font-semibold uppercase tracking-wider px-6 py-4">Estoque</th>
                <th class="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E5DCCB]/60">
              <tr
                v-for="produto in produtos"
                :key="produto.ProCodigo"
                class="hover:bg-[#FDFBF7] transition-colors"
              >
                <td class="px-6 py-4 text-[#A1887F] font-medium">#{{ produto.ProCodigo }}</td>
                <td class="px-6 py-4 text-[#2B1810] font-semibold">{{ produto.ProNome }}</td>
                <td class="px-6 py-4 text-right text-[#B57C4A] font-semibold">
                  R$ {{ produto.ProPreco.toFixed(2) }}
                </td>
                <td class="px-6 py-4 text-right">
                  <span
                    :class="produto.ProEstoque > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'"
                    class="inline-block text-xs px-2.5 py-1 rounded-full font-medium"
                  >
                    {{ produto.ProEstoque }} un
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
                      @click="excluir(produto.ProCodigo)"
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

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Produto {
  ProCodigo: number
  ProNome: string
  ProPreco: number
  ProEstoque: number
}

const produtos = ref<Produto[]>([])
const carregando = ref(false)
const salvando = ref(false)
const erro = ref('')
const editandoId = ref<number | null>(null)

const form = ref({ ProNome: '', ProPreco: 0, ProEstoque: 0 })

async function buscarProdutos() {
  carregando.value = true
  const res = await fetch('/produtos')
  produtos.value = await res.json()
  carregando.value = false
}

async function salvar() {
  erro.value = ''
  salvando.value = true

  const url = editandoId.value ? `/produtos/${editandoId.value}` : '/produtos'
  const method = editandoId.value ? 'PUT' : 'POST'

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value),
  })

  if (!res.ok) {
    const data = await res.json()
    erro.value = 'Erro ao salvar. Verifique os campos.'
    console.error(data)
  } else {
    resetarForm()
    await buscarProdutos()
  }

  salvando.value = false
}

async function excluir(id: number) {
  if (!confirm('Excluir este produto?')) return
  await fetch(`/produtos/${id}`, { method: 'DELETE' })
  await buscarProdutos()
}

function iniciarEdicao(produto: Produto) {
  editandoId.value = produto.ProCodigo
  form.value = { ProNome: produto.ProNome, ProPreco: produto.ProPreco, ProEstoque: produto.ProEstoque }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelarEdicao() {
  resetarForm()
}

function resetarForm() {
  editandoId.value = null
  form.value = { ProNome: '', ProPreco: 0, ProEstoque: 0 }
}

onMounted(buscarProdutos)
</script>

<style scoped>
.font-serif {
  font-family: 'Playfair Display', Georgia, serif;
}
.font-sans {
  font-family: 'Inter', sans-serif;
}
</style>