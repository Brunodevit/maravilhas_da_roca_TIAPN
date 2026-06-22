<script setup>
import { ref, onMounted, computed } from 'vue'
// @ts-ignore
import CartItem from './CartItem.vue'
import Cabecalho from '../components/cabecalho.vue'

const produtos = ref([])

// ===============================
// BUSCAR PRODUTOS
// ===============================
async function buscarProdutos() {
  try {
    console.log('Buscando produtos...')

    const resposta = await fetch('http://localhost:3000/carrinho')

    if (!resposta.ok) {
      throw new Error(`Erro: ${resposta.status}`)
    }

    const dados = await resposta.json()

    console.log('Produtos recebidos:', dados)

    // adiciona quantidade = 1
    produtos.value = dados.map(produto => ({
      ...produto,
      quantidade: 1
    }))

  } catch (erro) {
    console.error('Erro ao buscar produtos:', erro)
  }
}

// ===============================
// REMOVER PRODUTO
// ===============================
async function removerProduto(index) {

  console.log('CLICOU EM EXCLUIR')

  const produto = produtos.value[index]

  console.log(produto)

  if (!produto || !produto.id) {
    console.error('Produto inválido')
    return
  }

  try {
    const resposta = await fetch(
      `http://localhost:3000/carrinho/${produto.id}`,
      {
        method: 'DELETE'
      }
    )

    console.log('STATUS:', resposta.status)

    if (!resposta.ok) {
      throw new Error('Erro ao remover produto')
    }

    produtos.value.splice(index, 1)

    console.log('Produto removido!')

  } catch (erro) {
    console.error('Erro ao excluir:', erro)
  }
}

// ===============================
// ATUALIZAR QUANTIDADE
// ===============================
function atualizarQuantidade(index, novaQuantidade) {
  if (produtos.value[index]) {
    produtos.value[index].quantidade = novaQuantidade
  }
}

// ===============================
// TOTAL
// ===============================
const valorTotalGeral = computed(() => {
  const total = produtos.value.reduce((acc, produto) => {
    return acc + (
      Number(produto.preco) *
      Number(produto.quantidade)
    )
  }, 0)

  return total.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
})

// ===============================
// INICIAR
// ===============================
onMounted(() => {
  buscarProdutos()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-between w-full">

    <!-- LISTA -->
    <div class="w-full flex flex-col pb-44">

      <div class="w-full p-6 flex flex-col gap-6">

        <CartItem
          v-for="(produto, index) in produtos"
          :key="produto.id"
          :item="produto"
          @update:quantidade="atualizarQuantidade(index, $event)"
          @remover="removerProduto(index)"
        />

        <p
          v-if="produtos.length === 0"
          class="text-center text-gray-400 mt-10"
        >
          Nenhum produto encontrado
        </p>

      </div>

    </div>

    <!-- FOOTER -->
    <div class="fixed bottom-0 left-0 w-full bg-white p-6 border-t border-gray-200 flex justify-between items-center">

      <div>
        <p class="text-2xl font-bold text-[#3E2723]">
          Produtos
        </p>

        <p class="text-sm text-gray-400">
          Valor total:

          <span class="font-bold text-[#C5A880] text-lg">
            {{ valorTotalGeral }}
          </span>
        </p>
      </div>

      <button
        class="bg-[#C5A880] hover:bg-[#b89b70] text-white px-8 py-3 rounded-full font-bold transition-all"
      >
        Comprar
      </button>

    </div>

</div>
</template>