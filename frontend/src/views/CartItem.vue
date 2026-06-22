<script setup>
import { computed } from "vue";

const props = defineProps({
  item: { type: Object, required: true },
});

const emit = defineEmits(["update:quantidade", "remover"]);

const valorDoCard = computed(() => {
  const preco = Number(props.item?.preco) || 0;
  const quantidade = Number(props.item?.quantidade) || 0;
  return (preco * quantidade).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
});

function aumentar() {
  if (props.item) emit("update:quantidade", props.item.quantidade + 1);
}

function disminuir() {
  if (props.item && props.item.quantidade > 1) emit("update:quantidade", props.item.quantidade - 1);
}
</script>

<template>
  <div class="bg-white p-6 rounded-2xl border border-gray-100 flex gap-6 relative shadow-sm w-full max-w-4xl mb-4">
    <!-- IMAGEM -->
    <div class="w-36 h-36 bg-gray-100 border-2 border-[#C5A880] rounded-xl flex items-center justify-center shrink-0">
      <img 
        :src="item.imagem && (item.imagem.startsWith('http://') || item.imagem.startsWith('https://')) 
          ? item.imagem 
          : `http://localhost:3000/uploads/${item.imagem || 'default.png'}`" 
        alt="Imagem do produto"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- INFO -->
    <div class="flex flex-col justify-start pt-1 flex-1 relative text-left">
      <button @click.stop="$emit('remover')" type="button" class="absolute top-0 right-0 text-gray-300 hover:text-red-500 transition-colors z-50">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      <h3 class="text-2xl font-bold text-[#3E2723] leading-tight pr-8">
        {{ item?.nome || "Produto" }}
      </h3>
      <p class="text-base text-gray-400 mt-2">{{ item?.legenda || "Item do carrinho" }}</p>
      <p class="text-xl font-bold text-[#C5A880] mt-3">{{ valorDoCard }}</p>
    </div>

    <!-- CONTROLE QUANTIDADE -->
    <div class="absolute bottom-6 right-6 bg-[#C5A880] text-white font-semibold flex items-center gap-3 px-3 py-1.5 rounded-full">
      <button @click="disminuir" class="hover:text-[#3E2723] text-lg px-2 select-none">-</button>
      <span class="text-base min-w-[20px] text-center select-none">{{ item?.quantidade || 0 }}</span>
      <button @click="aumentar" class="hover:text-[#3E2723] text-lg px-2 select-none">+</button>
    </div>
  </div>
</template>