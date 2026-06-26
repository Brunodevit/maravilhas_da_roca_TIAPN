<script setup lang="ts">
import { onMounted, computed } from "vue";
import Footer from "../components/footer.vue";
import { useShopStore, type Product } from "../stores/shop";
import { addToCart } from "../services/cartService";

const shop = useShopStore();

// As categorias mapeiam a lista de produtos centralizada na Store
const categories = computed(() => {
  const unique = new Set(
    shop.products
      .map((p) => p.category || p.procategoria || p.ProCategoria)
      .filter(Boolean),
  );
  return ["Todas", ...Array.from(unique)];
});

// O filtro lê a lista de produtos direto da Store
const filteredProducts = computed(() => {
  let list = shop.products;

  if (shop.selectedCategory !== "Todas") {
    list = list.filter((p) => {
      const pCat = p.category || p.procategoria || p.ProCategoria;
      return pCat === shop.selectedCategory;
    });
  }

  const query = shop.searchQuery.trim().toLowerCase();
  if (!query) return list;

  return list.filter((p) => p.name?.toLowerCase().includes(query));
});

const addProductToCart = async (product: Product) => {
  const p = product as any;
  const estoqueVindo =
    p.ProEstoque !== undefined
      ? p.ProEstoque
      : p.stock !== undefined
        ? p.stock
        : p.estoque;

  if (estoqueVindo !== undefined && estoqueVindo <= 0) {
    alert(
      `Desculpe! O produto "${product.name}" está temporariamente esgotado. 🌾`,
    );
    return;
  }

  try {
    await addToCart(Number(product.id), 1);
    shop.addCart(1);
  } catch (error) {
    console.error("Erro ao adicionar ao carrinho:", error);
    shop.addCart(-1);
  }
};

const isProcessing = (id: number | string) =>
  shop.togglingFavorites.includes(Number(id));

const toggleFavorite = async (productId: number | string) => {
  const id = Number(productId);
  if (shop.togglingFavorites.includes(id)) return;

  try {
    await shop.toggleFavorite(id);
  } catch (e) {
    console.error("Erro ao alternar favorito:", e);
  }
};

const favoriteIds = computed(() =>
  shop.favorites.map((f) => Number(f.ProCodigo)),
);

onMounted(() => {
  shop.loadProducts();
});
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-[#FAF6EE] via-[#FDFBF7] to-[#F3EAD9] text-[#4A3728] antialiased selection:bg-[#EED9C4]"
  >
    <section
      class="max-w-6xl mx-auto px-4 pt-12 sm:pt-16 pb-8 sm:pb-12 text-center"
    >
      <div
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EED9C4]/50 border border-[#D9B48F]/40 text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#A0522D] mb-4 sm:mb-6 shadow-sm"
      >
        🌾 Tradição Mineira Extraído com Afeto
      </div>

      <h1
        class="text-3xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight text-[#362212] max-w-5xl mx-auto leading-[1.15] sm:leading-[1.08]"
      >
        <span class="underline decoration-[#A0522D]/30 decoration-wavy">
          O puro sabor do campo, <br class="hidden sm:inline" />
          direto na sua mesa
        </span>
      </h1>

      <p
        class="text-sm sm:text-xl text-[#7A5C43] max-w-2xl mx-auto mt-4 sm:mt-6 leading-relaxed font-light px-2"
      >
        Descubra pequenos lotes artesanais de queijos premiados, doces de tacho
        e relíquias mineiras autênticas.
      </p>
    </section>

    <section class="w-full max-w-7xl mx-auto px-4 mb-8 sm:mb-12 select-none">
      <div
        class="flex items-center sm:justify-center gap-2 sm:gap-3 overflow-x-auto sm:overflow-visible whitespace-nowrap sm:flex-wrap py-2 scrollbar-none"
      >
        <button
          v-for="category in categories"
          :key="category"
          @click="shop.selectedCategory = category"
          class="flex-shrink-0 px-4 sm:px-6 py-2 rounded-full text-[11px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.2em] transition-all duration-300 active:scale-95"
          :class="[
            shop.selectedCategory === category
              ? 'bg-[#362212] text-[#FAF6EE] shadow-sm font-bold'
              : 'text-[#7A5C43]/70 hover:text-[#362212] hover:bg-[#EED9C4]/20',
          ]"
        >
          {{ category }}
        </button>
      </div>

      <div class="w-12 h-px bg-[#A0522D]/20 mx-auto mt-4 sm:mt-6"></div>
    </section>

    <main class="max-w-7xl mx-auto px-2 sm:px-4 pb-20">
      <div
        v-if="shop.isLoadingProducts"
        class="flex flex-col justify-center items-center py-40 space-y-4"
      >
        <div
          class="w-16 h-16 border-4 border-[#EED9C4]/30 border-t-[#A0522D] rounded-full animate-spin"
        ></div>
      </div>

      <div
        v-else
        class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-8"
      >
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="relative group bg-white rounded-2xl sm:rounded-[2.2rem] border border-[#EED9C4]/20 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          <div
            class="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-1 sm:gap-2 z-20"
          >
            <button
              @click="toggleFavorite(product.id)"
              :disabled="isProcessing(product.id)"
              class="w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/95 border border-[#EED9C4] hover:border-red-400 transition disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-3.5 h-3.5 sm:w-5 sm:h-5 transition-transform duration-100"
                :class="[
                  favoriteIds.includes(Number(product.id))
                    ? 'text-red-500 fill-red-500 scale-110'
                    : 'text-[#422A17]',
                  isProcessing(product.id) ? 'opacity-50' : '',
                ]"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>

            <button
              @click="addProductToCart(product)"
              :class="{
                'opacity-40 cursor-not-allowed':
                  product.ProEstoque !== undefined && product.ProEstoque <= 0,
              }"
              class="w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/95 border border-[#EED9C4] hover:border-[#A0522D] transition shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#422A17]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9m-6-9v9"
                />
              </svg>
            </button>
          </div>

          <div class="aspect-[4/3] bg-[#FAF6EE] overflow-hidden">
            <img
              :src="
                product.image &&
                (product.image.startsWith('http://') ||
                  product.image.startsWith('https://'))
                  ? product.image
                  : `https://maravilhas-da-roca-tiapn.onrender.com/uploads/${product.image || 'default.png'}`
              "
              alt="Imagem do produto"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="p-3 sm:p-5">
            <h2
              class="font-serif font-black text-[#362212] text-xs sm:text-lg truncate"
            >
              {{ product.name }}
            </h2>
            <p
              class="text-[11px] sm:text-sm text-[#7A5C43] mt-1 line-clamp-2 h-7 sm:h-10 font-light leading-tight"
            >
              {{ product.description }}
            </p>

            <div
              class="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 sm:mt-4 gap-1 sm:gap-0"
            >
              <span
                class="text-xs sm:text-lg font-black text-[#362212] whitespace-nowrap"
                >R$ {{ Number(product.price || 0).toFixed(2) }}</span
              >
              <router-link
                :to="{ name: 'descricao-produto', params: { id: product.id } }"
                class="text-[10px] sm:text-xs font-semibold py-1 sm:py-2 px-2 sm:px-4 rounded-full text-[#422A17] hover:text-[#A0522D] hover:bg-[#EED9C4]/40 transition text-left sm:text-center shrink-0 origin-left"
              >
                Ver detalhes →
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>
